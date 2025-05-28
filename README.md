# 📅 Appointment Service

Servicio Serverless para la gestión de citas, desarrollado con AWS Lambda y desplegado mediante AWS SAM. Este microservicio permite la creación, consulta y gestión de citas en un entorno escalable y altamente disponible.

---

## 🚀 Tecnologías

- Node.js + TypeScript
- AWS Lambda
- AWS API Gateway
- AWS EventBridge
- AWS SNS
- AWS SQS
- AWS DynamoDB
- AWS RDS
- AWS SAM (Serverless Application Model)
- Jest (pruebas unitarias)

---

## 📂 Estructura del Proyecto

```
appointment-service/
│
├── events/                  # Eventos de ejemplo para pruebas locales
├── src/
│   └── functions/           # Lambdas individuales
│         ├── http/          # Funciones Lambda invocadas mediante solicitudes HTTP (API Gateway)
│         └── sqs/           # Funciones Lambda desencadenadas por eventos de SQS
├── template.yaml            # Definición de recursos SAM
└── README.md
```

---

## ⚙️ Instalación y Despliegue

### 🔧 Requisitos previos

- Node.js ≥ 18.x
- AWS CLI configurado (`aws configure`)
- AWS SAM CLI instalado

### 🛠 Instalación

```bash
git clone https://github.com/jessdev-looroh/appointment-service.git
cd appointment-service
yarn
```

### 🚢 Despliegue con SAM

Si se tiene un archivo de configuración:

```bash
sam build --beta-features
sam deploy --guided --config-file samconfig.dev.toml  #tenemos un archivo de configuración dependiendo del ambiente
```
Si no se tiene un archivo de configuración:

```bash
sam build --beta-features
sam deploy --guided
```

Durante el `--guided`, puedes configurar:

- Nombre del stack
- Región AWS
- Parámetros como stage (`dev`, `prod`), etc.

---

## 📮 Endpoints disponibles

Cuando se despliega el proyecto podrás ver en consola la url creada.

> Base URL: `https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/`

### Crear una cita

```
POST api/appointments
```

**Body ejemplo:**
```json
{
    "insuredId": "00002",
    "scheduleId": 8,
    "countryISO": "PE"
}
```

---

### Obtener citas por id del asegurado

```
GET api/appointments/{insuredId}
```

---

<!-- ## 🧪 Pruebas

```bash
npm test
```

> Las pruebas están ubicadas en la carpeta `/tests` y utilizan Jest como framework.

--- -->

## 📌 Variables de entorno

Se definen dentro del archivo de configuración `samconfig.dev.toml` y puedes sobrescribirlas en tiempo de despliegue. 


## 👨‍💻 Autor

**Jess Figueroa**  
[GitHub @jessdev-looroh](https://github.com/jessdev-looroh)

---

## 📄 Licencia

MIT