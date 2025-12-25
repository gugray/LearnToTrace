#version 3.7;
global_settings { assumed_gamma 1.0 }

camera {
  location <0, 3, -8>
  look_at  <0, 1, 0>
  angle 35
}

#macro Correct_Pigment_Gamma(Orig_Pig, New_G)
  #local Correct_Pig_fn =
      function{ pigment {Orig_Pig} }
  pigment{ average pigment_map{
   [function{ pow(Correct_Pig_fn(x,y,z).x, New_G)}
               color_map{[0 rgb 0][1 rgb<3,0,0>]}]
   [function{ pow(Correct_Pig_fn(x,y,z).y, New_G)}
               color_map{[0 rgb 0][1 rgb<0,3,0>]}]
   [function{ pow(Correct_Pig_fn(x,y,z).z, New_G)}
               color_map{[0 rgb 0][1 rgb<0,0,3>]}]
   }}
#end

box {
  <-1, -1, -1>, < 1, 1, 1>
  texture{ uv_mapping
    //Correct_Pigment_Gamma(
      pigment {
        image_map{ png "sky-tile1/cubemap.png"
                   map_type 0    // planar
                   interpolate 2 // bilinear
                   once //
                 }
     }
     //, 2.2)
     finish { ambient 1 diffuse 0 }
  }
  scale 10
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
  rotate <0, 5, 0>
  texture {
    pigment { color rgb <1, 0, 0> }
    finish {
      ambient 0.1
      diffuse 0.9
      specular 0.8
      reflection 0.4
      metallic
      roughness 0.02
    }
  }
}
