
# rm -rf .aws-sam
# sam.cmd build

echo "############ DESPLIEGUE #############"
echo "Ingresa el perfil de aws: "
read PROFILE

sam.cmd deploy --guided --profile "${PROFILE}"