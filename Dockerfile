# ---- Etapa 1: compilar el build de React ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Etapa 2: nginx + fail2ban sirviendo el build ----
FROM nginx:1.27-alpine
RUN apk add --no-cache fail2ban iptables

# Quitamos TODOS los jails que la imagen trae activados por defecto (sshd, etc.)
# Solo queremos el jail http-flood que definimos nosotros.
RUN rm -f /etc/fail2ban/jail.d/*.conf

# quitamos el symlink a stdout de la imagen oficial: fail2ban necesita un archivo real
RUN rm -f /var/log/nginx/access.log /var/log/nginx/error.log

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY jail.local /etc/fail2ban/jail.local
COPY filter-http-flood.conf /etc/fail2ban/filter.d/http-flood.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
