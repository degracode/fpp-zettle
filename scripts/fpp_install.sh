#!/bin/bash

# fpp-zettle install script

echo "Installing Announce Zettle Plugin for FPP...."

echo "Writing config file...."

touch /home/fpp/media/config/plugin.fpp-zettle.json
defalt_json=$(cat <<EOF
{
  "client_id": "",
  "client_secret": "",
  "organizationUuid": "",
  "subscriptions": [],
  "effect": ""
}
EOF
)

echo "$defalt_json" > /home/fpp/media/config/plugin.fpp-zettle.json

sudo chown fpp /home/fpp/media/config/plugin.fpp-zettle.json

echo "You need a secure https endpoint on your pi to use this plugin. Dataplicity is the easiest way to achieve that. Check out the readme or the plugin help text for more information."