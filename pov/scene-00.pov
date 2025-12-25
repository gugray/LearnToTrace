#version 3.7;
global_settings { assumed_gamma 1.0 }

background { color rgb <0.05, 0.05, 0.07> }

camera {
  location <0, 3, -8>
  look_at  <0, 1, 0>
  angle 35
}

light_source {
  <5, 8, -5>
  color rgb <1, 1, 1>
}

light_source {
  <-6, 4, -3>
  color rgb <0.6, 0.7, 1>
}

box {
  <-1, 0, -1>, <1, 2, 1>
  texture {
    pigment { color rgb <0.75, 0.75, 0.8> }
    finish {
      metallic
      reflection 0.4
      specular 0.8
      roughness 0.02
    }
  }
}

plane {
  y, 0
  texture {
    pigment { color rgb <0.2, 0.2, 0.2> }
    finish { diffuse 0.7 }
  }
}
