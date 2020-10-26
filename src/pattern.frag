#version 300 es
precision lowp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_mouse;
uniform vec3 u_palette[6];

const float pi = 3.141592653589793;
const float tau = pi * 2.0;
const float hpi = pi * 0.5;
const float phi = (1.0+sqrt(5.0))/2.0;

out vec4 outColor;


#define MAX_STEPS 100
#define MAX_DIST 50.
#define SURF_DIST .001

#define ROT(a) mat2(cos(a), -sin(a), sin(a), cos(a))
#define SHEARX(a) mat2(1, 0, sin(a), 1)

const float smoothness = 0.01;

vec3 getPaletteColor(float id)
{
    int last = u_palette.length() - 1;
    //return id < float(last) ? mix(u_palette[int(id)], u_palette[int(id) + 1], fract(id)) : u_palette[last];
    return mix(u_palette[int(id)], u_palette[int(id) + 1], fract(id));
}
// 2d rotation matrix helper
mat2 Rot(float a) {
    float x = cos(a);
    float y = sin(a);
    return mat2(x, -y, y, x);
}


void main(void)
{
    vec2 uv = (gl_FragCoord.xy-.5*u_resolution.xy)/u_resolution.y;
    //vec2 m = u_mouse.xy/u_resolution.xy;

    uv *= Rot(u_time * 0.23);

    float grid = mix(18.0, 4.0, cos(u_time * 0.17) * 0.5 + 0.5 );

    vec2 pos = fract(uv * grid) - 0.5;
    vec2 id = floor(uv * grid);


    float c = 0.0;
    for (float y = -1.0; y <= 1.0; y++){
        for (float x = -1.0; x <= 1.0; x++) {

            vec2 off = vec2(x,y);
            float d = length(pos - off);

            float d2 = length(id + off) * mix(1.0,10.0, 0.5 + cos(u_time * 0.07) * 0.5);
            float size = mix(0.5,1.5, 0.5 + sin(u_time + d2) * 0.5);
            c += smoothstep(size + smoothness, size - smoothness,d);
        }
    }
    outColor = vec4(
        u_palette[int(mod(c,4.0))],
        1.0
    );

    //outColor = vec4(1,0,1,1);
}
