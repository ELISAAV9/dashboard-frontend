#!/bin/sh
set -e

mkdir -p /var/log/nginx /var/run/fail2ban /var/lib/fail2ban
touch /var/log/nginx/access.log /var/log/nginx/error.log

# Arrancamos fail2ban en segundo plano. Si llegara a fallar (por ejemplo, por
# permisos de NET_ADMIN en el host), no debe tumbar todo el contenedor:
# el sitio debe seguir sirviéndose con nginx de cualquier forma.
fail2ban-server -b -x || echo "AVISO: fail2ban no pudo iniciar, nginx sigue sirviendo igual"

# nginx en primer plano, mantiene vivo el contenedor
exec nginx -g 'daemon off;'
