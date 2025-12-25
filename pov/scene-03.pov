#version 3.7;
global_settings { assumed_gamma 1.0 }



camera {
  location <0, 0, -8>
  look_at  <0, 0, 0>
  angle 35
}

box {
  <-1, -1, 0>, <1, 1, 0.1>
  scale 6
  translate <0, 0, 10>
  texture {
    uv_mapping pigment {
      //color rgbt <1, 0, 0, 0.9>
      image_map {
        png "sky-tile1/cubemap.png"
        map_type 0
        interpolate 2
        once
      }
    }
    finish { ambient 1 diffuse 0 }
  }

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
  <-1, -0.75, -0.5>, <1, 0.75, 0.5>
  //rotate <0, 5, 0>
  rotate <clock * 355, clock * 365, clock * 375>
  texture {
    //pigment { color rgbt <1, 0, 0, 0.9> }
    //pigment { color rgbt <0.8, 0.04, 0.1, 0.9> }
    pigment{ color rgb <0.8, 0.04, 0.1> transmit 0.9 }
    finish {
      ambient 0
      diffuse 0
      specular 0.9
      reflection 0.0
      roughness 0.01
      metallic 0
      ior 1.1
    }
  }
}
