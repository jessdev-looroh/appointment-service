#!/bin/bash

echo "🧪 Iniciando tests en todas las Lambdas..."

# Ejecutar tests en el paquete shared primero
if [ -d "./packages/shared" ]; then
    echo "-----------------------------------------"
    echo "📦 Ejecutando tests en paquete shared"
    if [ -f "./packages/shared/yarn.lock" ]; then
        (cd ./packages/shared && yarn test)
    else
        (cd ./packages/shared && npm test)
    fi
    exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo "❌ Fallaron los tests en el paquete shared. Abortando pruebas."
        exit 1
    else
        echo "✅ Tests ejecutados exitosamente en: shared"
    fi
fi

# Buscar package.json en funciones, ignorando node_modules
find ./src/functions -type f -name "package.json" \
    -not -path "*/node_modules/*" | while read package_json; do

    dir=$(dirname "$package_json")
    lambda_name=$(basename "$dir")

    # Verificar que exista un script de test en package.json
    if grep -q '"test"\s*:' "$package_json"; then
        # Verificar que existe el directorio tests y tiene al menos un archivo
        if [ -d "$dir/tests" ] && [ "$(find "$dir/tests" -type f -name '*.ts' -o -name '*.js' | wc -l)" -gt 0 ]; then
            echo "-----------------------------------------"
            echo "📦 Ejecutando tests en Lambda: $lambda_name"
            echo "📂 Ruta: $dir"

            # Elegir yarn o npm
            if [ -f "$dir/yarn.lock" ]; then
                cmd="yarn test"
            else
                cmd="npm test"
            fi

            # Ejecutar tests
            (cd "$dir" && $cmd)
            exit_code=$?

            if [ $exit_code -eq 0 ]; then
                echo "✅ Tests ejecutados exitosamente en: $lambda_name"
            else
                echo "❌ Fallaron los tests en: $lambda_name"
                exit 1
            fi
        else
            echo "⚠️  Saltando $lambda_name: no hay archivos de test en el directorio 'tests/'."
        fi
    else
        echo "⚠️  Saltando $lambda_name: no tiene script 'test' definido en package.json."
    fi
done
