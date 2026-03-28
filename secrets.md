# Seales secret sample code
1. Create the Plaintext File
Create a file named dockerconfig.json with your credentials. Do not commit this file.
```bash
echo '{"auths":{"ghcr.io":{"auth":"BASE64_ENCODED_TOKEN"}}}' > dockerconfig.json
```
Use code with caution.

2. Generate the Kubernetes Secret (Dry Run)
This creates a local secret.yaml without actually uploading it to the cluster.
```bash
kubectl create secret generic ghcr-secret \
  --namespace budgetwise \
  --type=kubernetes.io/dockerconfigjson \
  --from-file=.dockerconfigjson=dockerconfig.json \
  --dry-run=client -o yaml > secret.yaml
```
Use code with caution.

3. Seal the Secret
This encrypts the secret using the cluster's public key. The resulting sealed-secret.yaml is safe to commit to GitHub.
```bash
# If your kubeconfig is in a custom location:
KUBECONFIG=/path/to/custom/config kubeseal --format yaml < secret.yaml > sealed-secret.yaml
```
Use code with caution.

4. Cleanup
Immediately delete the plaintext files to stay secure.
```bash
rm dockerconfig.json secret.yaml
```