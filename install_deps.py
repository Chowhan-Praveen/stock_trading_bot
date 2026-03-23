import subprocess
import sys

with open("requirements.txt", "r") as f:
    deps = [line.strip() for line in f.readlines() if line.strip() and not line.startswith("#")]

failed = []
for dep in deps:
    print(f"Installing {dep}...")
    result = subprocess.run([r".\venv_win\Scripts\python.exe", "-m", "pip", "install", dep, "--progress-bar", "off"], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"FAILED: {dep}")
        print(result.stderr)
        failed.append(dep)
    else:
        print(f"SUCCESS: {dep}")

if failed:
    print("\n--- FAILED PACKAGES ---")
    for f in failed:
        print(f)
    sys.exit(1)
print("\n--- ALL SUCCESSFUL ---")
