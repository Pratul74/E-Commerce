@Library("shared") _
pipeline{
    agent {
        label 'Agent1'
    }
    stages{
        stage("Code"){
            steps{
                echo "Clonning the Project code from github"
                script{
                    gitclone("https://github.com/Pratul74/E-Commerce.git", "main")
                }
            }
            
        }
        stage("Build"){
            steps{
                echo "Building the docker image"
                script{
                    dockerbuild("ecommerce", "./backend")
                }
            }
        }
        stage("Test"){
            steps{
                echo "Testing the app"
            }
        }
        stage("Deploy") {
            steps {
                echo "Deploying the code"
                script{
                    dockercompose("ecommerceenv", "secret_file")
                }
            }
        }
    }
}
