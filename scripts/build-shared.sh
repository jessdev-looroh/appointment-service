#!/bin/bash
# 🔍 Detectar si usar npm o yarn
if [ -f "./packages/shared/yarn.lock" ]; then
  PKG_MANAGER="yarn"
elif [ -f "./packages/shared/package-lock.json" ]; then
  PKG_MANAGER="npm"
else
  echo "❌ No se encontró ni package-lock.json ni yarn.lock en package/shared"
  exit 1
fi

echo "📦 Usando $PKG_MANAGER para instalar dependencias de shared..."

# ▶️ Ir a carpeta shared
cd packages/shared

echo "📥 Instalando dependencias..."
if [ "$PKG_MANAGER" = "yarn" ]; then
  yarn install
else
  npm install
fi

echo "🛠️ Compilando shared..."
$PKG_MANAGER run build

echo "📁 Copiando archivos a carpeta temporal..."
cd ..
rm -rf shared-tmp
mkdir -p shared-tmp
cp -r shared/dist/* shared-tmp/
cp shared/package.json shared-tmp/

echo "📦 Empaquetando shared..."
cd shared-tmp

VERSION_TAG=$(date +%s) # timestamp actual
TARBALL_NAME="shared-${VERSION_TAG}.tgz"

$PKG_MANAGER pack --filename "$TARBALL_NAME"

# Copiar el tarball a todas las funciones Lambda
FUNCTIONS=(
  "../../src/functions/sqs/create_appointment_fn"
  "../../src/functions/sqs/update_appointment_fn"
  "../../src/functions/http/post_appointment_fn"
  "../../src/functions/http/get_appointment_fn"
)

echo "📂 Copiando e instalando .tgz en funciones Lambda..."

# Función para instalar en una función Lambda
install_in_function() {
  local FUNCTION_PATH=$1
  local TARBALL_NAME=$2
  local PKG_MANAGER=$3
  
  if [ -d "$FUNCTION_PATH" ]; then
    echo "📦 Procesando $FUNCTION_PATH..."
    
    rm -f "$FUNCTION_PATH"/*.tgz

    cp "$TARBALL_NAME" "$FUNCTION_PATH/"
    cd "$FUNCTION_PATH"
    
    # Remover versión anterior si existe
    if grep -q "\"shared\":" "package.json"; then
      $PKG_MANAGER remove shared
    fi
    
    # Instalar nueva versión
    $PKG_MANAGER add file:./"$TARBALL_NAME"
    
    echo "✅ Completado $FUNCTION_PATH"
  else
    echo "⚠️ Directorio no encontrado: $FUNCTION_PATH"
  fi
}

# Ejecutar instalaciones en paralelo
for FUNCTION_PATH in "${FUNCTIONS[@]}"; do
  install_in_function "$FUNCTION_PATH" "$TARBALL_NAME" "$PKG_MANAGER" &
done

# Esperar a que todas las instalaciones terminen
wait

echo "✅ Proceso completado"

