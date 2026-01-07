pipeline {
    agent any

    environment {
        DOCKER_USER = 'jhontorres88'
        IMAGE_NAME = 'proyecto-devops-misia'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-auth')
        SONAR_TOKEN = credentials('sonar-token')
    }

    stages {
        stage('1. Clonado del Repositorio') {
            steps {
                checkout scm
                echo "Repositorio clonado exitosamente."
            }
        }

        stage('2. Tests Automatizados') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('3. Análisis de Calidad (SonarQube)') {
            steps {
                echo "Iniciando análisis de calidad con SonarQube..."
                withSonarQubeEnv('SonarQubeServer') {
                    sh "npm run sonar"
                }
            }
        }

        stage('4. Construcción de Imagen Docker') {
            steps {
                sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_NUMBER} ."
                sh "docker tag ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_NUMBER} ${DOCKER_USER}/${IMAGE_NAME}:latest"
            }
        }

        stage('5. Análisis de Seguridad (Trivy)') {
            steps {
                // Escaneo de vulnerabilidades en la imagen Docker recién creada
                echo "Analizando seguridad de la imagen con Trivy..."
                sh "trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_NAME}:latest"
            }
        }

        stage('6. Publicación en DockerHub') {
            steps {
                // Acceso seguro y subida de la imagen al registro público
                sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
                sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_NUMBER}"
                sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:latest"
            }
        }
    }

    post {
        always {
            echo "Limpiando el espacio de trabajo..."
            deleteDir()
        }
        success {
            echo "Pipeline finalizado exitosamente. Imagen disponible en DockerHub."
        }
        failure {
            echo "El pipeline ha fallado. Revisa los logs de Jenkins."
        }
    }
}