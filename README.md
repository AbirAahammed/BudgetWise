# Budgetwise application 

Manage your budget all in one place.


## Sealed Secret


```bash
cat <<EOF > dockerconfig.json
{"auths":{"ghcr.io":{"username":"abiraahammed","password":"ghp_XXXXX","email":"ahammed.abir47@gmail.com","auth":"XXXXX"}}}
EOF
```

```bash
kubectl create secret generic ghcr-secret \
  --namespace budgetwise \
  --type=kubernetes.io/dockerconfigjson \
  --from-file=.dockerconfigjson=dockerconfig.json \
  --dry-run=client -o yaml > secret.yaml
```
```bash
kubeseal --format yaml < secret.yaml > sealed-secret.yaml
```