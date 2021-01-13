#!/usr/bin/env python3

import sys
import json
import random
import time

resultChoices = ["up", "down", "unknown"]

gamename = sys.argv[1]
levelcount = int(sys.argv[2])
datapoints = int(sys.argv[3])
allout = []
out = []

for i in range(levelcount):
    levelname = f"{gamename}{i}"
    rec = {
        "name": levelname,
        "data": []
    }

    for j in range(datapoints):
        dprec = {
            "status": random.choice(resultChoices),
            "timestamp": time.time() - (100000 * j) - (100*i),
            "elapsed":  1.0 + random.random() * 3.0,
        }
        if j == 0:
            fullrec = {
                "name": levelname,
            }
            fullrec.update(dprec)
            out += [fullrec]

        rec["data"] += [dprec]

    allout += [rec]

json.dump(allout, open(f"data/archive-{gamename}.json", "w"))
json.dump(out, open(f"data/game-{gamename}.json", "w"))
