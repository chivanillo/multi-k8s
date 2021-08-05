# Definitions

- Kubernetes is a system to deploy containerized apps
- Node is a VM that run containers
- Masters is a VM with a set of programs to manage nodes

* Service: Object to set up networking in a Kubernetes cluster. Subtypes (spec -> type):
  - ClusterIP -> Exposes a set of pods to other objects in the cluster
  - NodePort -> Exposes a container to the outside world. Not used for PROD env (only good for dev purposes!!)
  - LoadBalancer -> Legacy way of getting network traffic into a cluster
  - Ingress -> Exposes a set of services to the outside world

The way Pod and Service are communicated is by having a key,value of:

- Service => selector: 'component: web'
- Pod => label: 'component: web'

Ports:

- targetPort: Identical as the containerPort in the Pod. We want to send any incoming traffic to the containerPort
- port: Other Pod that needs multi-client Pod. Assigned in the range of 30000-32767
- nodePort: Used in the browser in our to access the multi-client Pod (available to outside world). If not specific, a random

# Create a config file to kubectl

> kubectl create -f <config_file>

# Feed a config file to kubectl

> kubectl apply -f <config_file>

kubectl: CLI we use to change our Kubernetes cluster  
apply: Change the current configuration of our cluster

# Print the status of all running pods

> kubectl get <pods/services/deployments/pv/pvc/secrets>

get: Retrieve information about a running project  
pods: Specifies the object type that we want to get information about

# Describe detail information about a specific object

> kubectl describe pod <object name - optional>

# Deleting an object. Gets 10 sec to resolve

> kubectl delete -f <config_file>

# Imperative command to update image

> kubectl set image <object_type>/<object_name> <container_name> = <new image to use>

i.e. kubectl set image deployment/client-deployment client=chivanillo/multi-client:v1

# IP to get access to any application that is running inside minikube

> minikube ip

# Shell terminal to access to docker containers and images inside minikube

> minikube ssh

# Configure the VM to use your Docker Server. This only configures your current Terminal window

> eval $(minikube docker-env)

# Creating a Secret through an imperative command

> kubectl create secret generic <secret_name> --from-literal key=value

create: Imperative command to create a new object  
generic: Type of secret. Other types: docker-registry, tls  
secret_name: Name of secret, for later reference in a Pod config  
--from-literal: We are going to add the secret information into this command, as opposed to from the config file.  
key=value: Key-value pair of the secret information

> kubectl create secret generic pgpassword --from-literal PGPASSWORD=postgres_password

NODE  
Nginx Ingress: https://github.com/kubernetes/ingress-nginx (community led project)  
 |  
 | ==> ClusterIP Service: Deployment[multi-client pod, multi-client pod, multi-client pod]  
 | ==> ClusterIP Service: Deployment[multi-server pod, multi-server pod, multi-server pod]  
 |  
 | ==> ClusterIP Service: Deployment[Redis pod] <== Deployment[multi-worker pod]  
 |  
 | ==> ClusterIP Service: Deployment[Postgres pod] ===> Postgres PVC

# Kubernetes:

## Step 1: Start Kubernetes

> minikube start --vm-driver=virtualbox

## Step 2: Create password object used in different yaml files

> kubectl create secret generic pgpassword --from-literal PGPASSWORD=postgres_password

## Step 3: Apply all config files

> kubectl apply -f .

# Open Kubernetes Dashboard

> minikube dashboard

# Tagging Docker Images:

We will be using an additional tag using the GIT_SHA to tag the image.
Getting Git SHA for a commit:

> git rev-parse HEAD
> Print out all git SHA for every single commit:
> git log

New build command:

> docker build -t chivanillo/multi-client:latest -t chivanillo/multi-client:$GIT_SHA -f ./client/Dockerfile ./client

The Image will have 2 tags:

- Tag 1: chivanillo/multi-client:latest
- Tag 2: chivanillo/multi-client:$GIT_SHA

New Set Image command:

> kubectl set image deployment/multi-client-deployment client=chivanillo/multi-client:$GIT_SHA

# HELM:

Helm is a program that we can use to administer third party software inside of our Kubernetes cluster. More on https://github.com/helm/helm.
Command we issue => Helm Client => Tiller Server

- Tiller Server: Pod running inside of our cluster and will attempt to make changes to the configuration of our cluster

# Role Based Access Control (RBAC):

- Limits who can access and modify objects in our cluster
- Enabled on Google Cloud by default
- Tiller wants to make changes to our cluster, so it needs to get some permissions set

User Accounts: Identifies a person administering our cluster
Service Accounts: Identifies a pod administering a cluster
ClusterRoleBinding: Authorizes an accounter to do a certain set of actions across the entire cluster
RoleBinding: Authorizes an account to do a certain set of actions in a single namespace

# Creating a Service Account and related ClusterRoleBinding and tie it to Tiller

Create a new service account called tiller in the kube-system namespace:

> kubectl create serviceaccount --namespace kube-system tiller
> Create a new clusterrolebinding with the role 'cluster-admin' and assign it to the service account 'tiller'  
> kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller

# Init Helm

> helm init --service-account tiller --upgrade
> --upgrade: Ensure to use the latest version of helm

# Certification Manager

More information at: https://github.com/jetstack/cert-manager
