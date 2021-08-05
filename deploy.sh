docker build -t chivanillo/multi-client:latest -t chivanillo/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t chivanillo/multi-server:latest -t chivanillo/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t chivanillo/multi-worker:latest -t chivanillo/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push chivanillo/multi-client:latest
docker push chivanillo/multi-server:latest
docker push chivanillo/multi-worker:latest

docker push chivanillo/multi-client:$SHA
docker push chivanillo/multi-server:$SHA
docker push chivanillo/multi-worker:$SHA

kubectl apply -f k8s
kubectl set image deployments/client-deployment client=chivanillo/multi-client:$SHA
kubectl set image deployments/server-deployment server=chivanillo/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=chivanillo/multi-worker:$SHA
