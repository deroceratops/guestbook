#!/usr/bin/bash

green='\033[1;32m'
red='\e[31m'
clear='\033[0m'

TXID=$(curl --silent --request POST --data-binary @guestbook.bas http://127.0.0.1:30000/install_sc | sed 's/{"txid":"//;s/"}//')

if [[ $TXID == "" ]]; then
  printf "${red}Could not install the smart contract. Did you start the DERO simulator?\n${clear}"
  exit 0
fi;

OUTPUTFILE="src/scid.js"

cat << EOT > $OUTPUTFILE
const scid = '$TXID';
export default scid;
EOT

printf "${green}The smart contract was installed.${clear}\nThe TXID $TXID was saved to the file $OUTPUTFILE\n"
