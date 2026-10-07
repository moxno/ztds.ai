"""
Executable entrypoint when running `python -m ztds`.
"""

import sys
from .cli import main

if __name__ == "__main__":
    sys.exit(main())
