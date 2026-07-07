import os
import subprocess
import sys

PROJECT_ID = "suraksha-ai-501609"

def set_secret(secret_id: str, value: str):
    secret_id = secret_id.strip()
    value = value.strip()
    if not secret_id or not value:
        return

    # Remove quotes if present
    if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
        value = value[1:-1]

    try:
        # Create secret if it doesn't exist (fails silently if it already exists)
        subprocess.run(
            ["gcloud", "secrets", "create", secret_id, "--replication-policy=automatic", f"--project={PROJECT_ID}"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False
        )

        # Add a new version with the secret value
        proc = subprocess.Popen(
            ["gcloud", "secrets", "versions", "add", secret_id, "--data-file=-", f"--project={PROJECT_ID}"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = proc.communicate(input=value.encode('utf-8'))
        
        if proc.returncode == 0:
            print(f"✅ Secret '{secret_id}' successfully uploaded/updated in Secret Manager.")
        else:
            err_msg = stderr.decode('utf-8').strip()
            print(f"❌ Failed to upload secret '{secret_id}': {err_msg}")
    except Exception as e:
        print(f"Error handling secret '{secret_id}': {e}")

def main():
    print(f"Starting Secret Migration to Google Secret Manager (Project: {PROJECT_ID})...\n")

    # Paths to local environment files
    backend_env = "backend/.env"
    frontend_env = "frontend/.env.local"

    secrets = {}

    # Read backend environment variables
    if os.path.exists(backend_env):
        print(f"Reading secrets from {backend_env}...")
        with open(backend_env, "r") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                secrets[k.strip()] = v.strip()
    else:
        print(f"⚠️ Warning: {backend_env} not found.")

    # Read frontend environment variables
    if os.path.exists(frontend_env):
        print(f"Reading secrets from {frontend_env}...")
        with open(frontend_env, "r") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                secrets[k.strip()] = v.strip()
    else:
        print(f"⚠️ Warning: {frontend_env} not found.")

    if not secrets:
        print("No secrets detected. Exiting.")
        sys.exit(0)

    print(f"Found {len(secrets)} secrets to upload.\n")
    for k, v in secrets.items():
        set_secret(k, v)

    print("\nMigration complete! Ensure your GCP Service Account or Cloud Run service has the 'Secret Manager Secret Accessor' role.")

if __name__ == "__main__":
    main()
