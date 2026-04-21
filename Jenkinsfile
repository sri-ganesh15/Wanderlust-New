pipeline {
  agent any

  environment {
    DOCKER_USER = "sriganesh15"
    BACKEND_IMG = "backend"
    IMAGE_TAG   = "${BUILD_NUMBER}"
  }

  stages {

    stage("Checkout Code") {
      steps {
        git branch: 'main',
            url: 'https://github.com/sri-ganesh15/Wanderlust-New.git'
      }
    }

    stage("Build Backend Image") {
      steps {
          sh """
            docker build \
            -t $DOCKER_USER/$BACKEND_IMG:$IMAGE_TAG .
          """
      }
    }

    stage("Push Backend Image") {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'Ganesh_DockerId',
          usernameVariable: 'DOCKER_USERNAME',
          passwordVariable: 'DOCKER_PASSWORD'
        )]) {
          sh """
            echo $DOCKER_PASSWORD | docker login \
            -u $DOCKER_USERNAME --password-stdin

            docker push $DOCKER_USER/$BACKEND_IMG:$IMAGE_TAG
          """
        }
      }
    }

    stage("Deploy Backend to Kubernetes") {
      steps {
        sh """
          envsubst < k8s/deployment.yaml | kubectl apply -f -
          kubectl apply -f k8s/service.yaml
        """
      }
    }
  }

  post {
    success {
      echo "✅ Backend deployed successfully"
    }
    failure {
      echo "❌ Backend deployment failed"
    }
  }
}