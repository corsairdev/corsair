# Tiny Modal app for the live suite's functions, classes and functionCalls
# steps (api.test.ts). Deploy it once, then run the suite with
# MODAL_LIVE_APP=corsair-live-fn:
#   pip install modal && modal deploy packages/modal/tests/live_app.py
# Every function uses 0.125 CPU / 128 MiB and scales to zero after 2 s.
# Remove it afterwards with `modal app stop corsair-live-fn`.
import time

import modal

app = modal.App("corsair-live-fn")
image = modal.Image.debian_slim(python_version="3.12")
small = dict(image=image, cpu=0.125, memory=128, timeout=60, max_containers=1, scaledown_window=2)


@app.function(**small)
def square(x: int) -> int:
    print(f"square({x})")
    return x * x


@app.function(**small)
def slow(seconds: int) -> str:
    time.sleep(seconds)
    return "done"


@app.cls(**small)
class Greeter:
    greeting: str = modal.parameter(default="hello")

    @modal.method()
    def greet(self, name: str) -> str:
        return f"{self.greeting} {name}"
