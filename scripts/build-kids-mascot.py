#!/usr/bin/env python3
"""Generate Devnetra's original CC0 chibi robot mascot as a self-contained glTF binary.

Requires: python3 -m pip install numpy trimesh
Deterministic primitive geometry; no external meshes or textures.
"""
from pathlib import Path
import argparse
import hashlib
import numpy as np
import trimesh

PALETTE = {
    "shell": "#9676FF",       # lavender
    "shell_lit": "#CBB8FF",
    "body": "#29D7F4",        # sky blue
    "body_shadow": "#129CCB",
    "face": "#272E6A",        # dark navy visor
    "eye": "#FFFFFF",
    "pupil": "#182D5B",
    "glint": "#FFFFFF",
    "cheek": "#FF70B4",
    "smile": "#FFFFFF",
    "sun": "#FFE044",        # lemon yellow
    "antenna": "#7B5EDF",
    "sole": "#5058BA",
    "heart": "#FF56A1",
}

def rgba(code):
    rgb=bytes.fromhex(code[1:])
    return list(rgb)+[255]

scene=trimesh.Scene()
counter=0

def ball(label,center,scale,color,subdivisions=3):
    global counter
    mesh=trimesh.creation.icosphere(subdivisions=subdivisions,radius=1.0)
    mesh.apply_scale(scale)
    mesh.apply_translation(center)
    mesh.visual.vertex_colors=np.tile(rgba(PALETTE[color]),(len(mesh.vertices),1))
    scene.add_geometry(mesh,node_name=f"{counter:03d}-{label}",geom_name=f"{counter:03d}-{label}")
    counter+=1

def rod(label,a,b,radius,color):
    global counter
    a=np.asarray(a,dtype=float)
    b=np.asarray(b,dtype=float)
    vec=b-a
    mesh=trimesh.creation.cylinder(radius=radius,segment=np.vstack([a,b]),sections=20)
    mesh.visual.vertex_colors=np.tile(rgba(PALETTE[color]),(len(mesh.vertices),1))
    scene.add_geometry(mesh,node_name=f"{counter:03d}-{label}",geom_name=f"{counter:03d}-{label}")
    counter+=1

# Head is oversized, marshmallow-shaped (60% of overall silhouette).
ball("big-soft-lavender-head",[0,1.77,0],[.91,.79,.63],"shell",4)
ball("forehead-halo",[0,2.28,.22],[.70,.12,.34],"shell_lit")
# Dark navy visor provides generous contrast for cartoon eyes.
ball("expressive-visor",[0,1.78,.552],[.75,.51,.125],"face",4)

# Child-friendly eyes: giant white ovals, dark pupils and glossy catchlights.
for side in (-1,1):
    x=.34*side
    ball(f"eye-white-{side}",[x,1.88,.684],[.218,.27,.06],"eye",4)
    ball(f"eye-pupil-{side}",[x,1.85,.745],[.109,.17,.045],"pupil",3)
    ball(f"eye-glint-{side}",[x-.045,1.924,.789],[.046,.069,.020],"glint",3)
    ball(f"blush-cheek-{side}",[side*.585,1.58,.665],[.127,.075,.042],"cheek",3)
    # Flat bubbly ear pads.
    ball(f"ear-{side}",[side*.89,1.72,.0],[.19,.26,.32],"body")
    ball(f"ear-highlight-{side}",[side*1.022,1.77,.10],[.065,.12,.15],"shell_lit",2)

# Soft smile with tiny linked beads forming a curve.
for i,x in enumerate(np.linspace(-.165,.165,15)):
    # Upturned ends; cheeky open smiling curve.
    y=1.56 + .105*(x/.165)**2
    ball(f"smile-{i}",[float(x),float(y),.695],[.025,.024,.012],"smile",2)

# Single optimistic sun antenna on a rounded stalk.
rod("antenna-stalk",[0,2.48,0],[0,2.68,0],.065,"antenna")
ball("sun-antenna",[0,2.74,0],[.18,.18,.18],"sun",3)
ball("sun-antenna-glow",[-.05,2.795,.115],[.043,.05,.02],"eye",2)

# Pear-shaped jellybean body, tiny arms and mittens.
ball("short-jellybean-torso",[0,.89,0],[.54,.60,.49],"body",4)
ball("soft-tummy",[0,.91,.29],[.37,.42,.27],"shell_lit",3)
for side in (-1,1):
    ball(f"shoulder-{side}",[side*.57,1.02,.00],[.22,.25,.26],"shell",3)
    rod(f"short-arm-{side}",[side*.69,.96,.03],[side*.82,.75,.12],.13,"body_shadow")
    ball(f"little-mitten-{side}",[side*.86,.72,.19],[.21,.23,.20],"shell",3)
    ball(f"stubby-leg-{side}",[side*.30,.39,.0],[.19,.28,.20],"body_shadow",3)
    ball(f"bouncy-foot-{side}",[side*.35,.21,.18],[.30,.20,.36],"sun",3)
    ball(f"shoe-sole-{side}",[side*.35,.105,.17],[.29,.07,.35],"sole",2)

# Heart badge: overlapping pink circles + tapered center (deliberately toy-like).
ball("heart-left",[-.11,1.01,.535],[.12,.12,.052],"heart",3)
ball("heart-right",[.11,1.01,.535],[.12,.12,.052],"heart",3)
ball("heart-bottom",[0,.91,.535],[.16,.15,.06],"heart",3)
ball("heart-sparkle",[0,1.075,.585],[.035,.039,.018],"eye",2)

parser=argparse.ArgumentParser()
parser.add_argument("--output",required=True)
args=parser.parse_args()
output=Path(args.output)
output.parent.mkdir(parents=True,exist_ok=True)
data=scene.export(file_type="glb")
output.write_bytes(data)
digest=hashlib.sha256(data).hexdigest()
print(f"Devnetra Mimo mascot: {len(scene.geometry)} meshes; {len(data)} bytes; sha256 {digest}")

