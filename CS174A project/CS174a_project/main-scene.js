window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
    class Assignment_Three_Scene extends Scene_Component {
        constructor(context, control_box)
        {
            // The scene begins by requesting the camera, shapes, and materials it will need.
            super(context, control_box);
            // First, include a secondary Scene that provides movement controls:
            if (!context.globals.has_controls)
                context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

            context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 100, 5), Vec.of(0, 100, 0), Vec.of(0, 1, 0));
            this.initial_camera_location = Mat4.inverse(context.globals.graphics_state.camera_transform);

            const r = context.width / context.height;
            context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

            const shapes = {
                torus: new Torus(15, 15),
                torus2: new (Torus.prototype.make_flat_shaded_version())(15, 15),
                // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                //        (Requirement 1)
                sphere: new Subdivision_Sphere(4),
                sun: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(4),
                dot: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(4),
                planet1: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
                planet2: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(3),
                planet3: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(4),
                ring: new (Torus.prototype.make_flat_shaded_version())(20,50),
                planet4: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(4),
                moon: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(1),

                //earth: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(20),

            };
            this.submit_shapes(context, shapes);

            // Make some Material objects available to you:
            //let x =
            this.materials =
                {
                    test: context.get_instance(Phong_Shader).material(this.lights, {ambient: .2}),
                    //ring: context.get_instance(Ring_Shader).material(),

                    // TODO:  Fill in as many additional material objects as needed in this key/value table.
                    //        (Requirement 1)

                    // for sun
                    //const t = this.animation_time / 1000,
                    //sun1: context.get_instance(Phong_Shader).material(window.lights, {ambient: 1}),
                    sun1: context.get_instance(Phong_Shader).material(Color.of(1,0,0,1), {ambient: 1}),
                    //sun1: context.get_instance(Phong_Shader).material(Color.of(this.sun_color, 0, (1 - this.sun_color), 1), {ambient: 1})

                    // for point light
                    point: context.get_instance(Phong_Shader).material(Color.of(1,0,1,1), {ambient: 1}),

                    // planet 1
                    plan1: context.get_instance(Phong_Shader).material(
                        Color.of(85.5/100, 89.5/100, 87/100, 1), 
                        {
                            ambient: 0,
                            diffusivity: 1,
                            specularity: 0,
                        }),

                    // planet 2
                    plan2: context.get_instance(Phong_Shader).material(
                        Color.of(45/100, 53/100, .5, 1),
                        {
                            ambient: 0,
                            diffusivity: .3,
                            specularity: 1,
                        }
                    ),

                    // planet 3
                    plan3: context.get_instance(Phong_Shader).material(
                        Color.of(126/279, 88/279, 65/279, 1),
                        {
                            diffusivity: 1,
                            specularity: 1,
                        }
                    ),

                    // planet 4
                    plan4: context.get_instance(Phong_Shader).material(
                        Color.of(68/100, 85/100, 90/100, 1),
                        {
                            specularity: 1,
                            smoothness: 1,
                        }
                    ),
                };

            this.lights = [new Light(Vec.of(0, 0, 0, 1), Color.of(0, 0, 0, 1), 1000)];
            this.attached = () => this.planet_1;
        }

        make_control_panel() {
            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
            this.key_triggered_button("View solar system", ["0"], () => this.attached = () => this.initial_camera_location);
            this.new_line();
            this.key_triggered_button("Attach to planet 1", ["1"], () => this.attached = () => this.planet_1);
            this.key_triggered_button("Attach to planet 2", ["2"], () => this.attached = () => this.planet_2);
            this.new_line();
            this.key_triggered_button("Attach to planet 3", ["3"], () => this.attached = () => this.planet_3);
            this.key_triggered_button("Attach to planet 4", ["4"], () => this.attached = () => this.planet_4);
            this.new_line();
            //this.key_triggered_button("Attach to planet 5", ["5"], () => this.attached = () => this.planet_5);
            this.key_triggered_button("Attach to moon", ["m"], () => this.attached = () => this.moon);
        }

        display(graphics_state) {
            graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
            const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

            //let model_transform = Mat4.identity();
            //this.shapes.sun.draw(graphics_state, model_transform, this.materials.sun1);


            // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 2 and 3)

            
            // TODO: THE SUN
            let model_transform = Mat4.identity();
            let sun_scale_coef = (t % 5) / 5 * 2;
            let sec_mod_ten = t % 10;
            let shrink = false;
            if(sec_mod_ten > 5) // to see if it should be increasing in size or shrinking
            {
                shrink = true;
            }
            
            let sun_scale = Mat.of(
                [100, 0, 0, 0],
                [0, 100, 0, 0],
                [0, 0, 100, 0],
                [0, 0, 0, 1]
            );
            

            let sun_color_coef = (t % 5) / 5;
            let sun_color = Color.of(sun_color_coef, 0, 1 - sun_color_coef, 1);

            
            if(shrink)
            {
                /*
                sun_scale = Mat.of(
                    [3 - sun_scale_coef, 0, 0, 0],
                    [0, 3 - sun_scale_coef, 0, 0],
                    [0, 0, 3 - sun_scale_coef, 0],
                    [0, 0, 0, 1]
                );
                */

                sun_color = Color.of(1 - sun_color_coef, 0, sun_color_coef, 1);
            }

            model_transform = model_transform.times(sun_scale);


            this.shapes.sun.draw(graphics_state, model_transform, this.materials.sun1.override({color: sun_color}));


            // TODO: THE POINT
            //draw point
            model_transform = Mat4.identity();
            let point_scale_coef = 10 ** (sun_scale_coef + 1);
            if (shrink)
            {
                point_scale_coef = 10 ** (3 - sun_scale_coef);
            }

            graphics_state.lights = [new Light(Vec.of(0,0,0,1), sun_color, point_scale_coef)];

            // TODO: CAR
            




            /*
            //TODO: PLANET 1

            //draw planets and rotate them
            model_transform = Mat4.identity();
            let p1_translation_coef = 5;
            let p1_translation = Mat4.translation([p1_translation_coef, 0, 0]);

            let p1_rotation_coef = 2 * Math.PI * t / 5;
            let p1_rotation = Mat4.rotation(p1_rotation_coef, Vec.of(0, 1, 0));

            model_transform = model_transform.times(p1_rotation).times(p1_translation);

            this.shapes.planet1.draw(graphics_state, model_transform, this.materials.plan1);
            this.planet_1 = model_transform;

            //TODO: PLANET 2
            model_transform = Mat4.identity();
            let p2_translation_coef = 8;
            let p2_translation = Mat4.translation([p2_translation_coef, 0, 0]);

            let p2_rotation_coef = 2 * Math.PI * t / 8;
            let p2_rotation = Mat4.rotation(p2_rotation_coef, Vec.of(0, 1, 0));

            model_transform = model_transform.times(p2_rotation).times(p2_translation);

            let ceil_modded = Math.ceil(t % 2);
            let odd_even = 0;
            if (ceil_modded === 2) // every odd second, odd_even is 1
            {
                odd_even = 1;
            }

            this.shapes.planet2.draw(graphics_state, model_transform, this.materials.plan2.override({gouraud: odd_even}));
            this.planet_2 = model_transform;



            //TODO: PLANET 3
            model_transform = Mat4.identity();
            let p3_translation_coef = 11;
            let p3_translation = Mat4.translation([p3_translation_coef, 0, 0]);

            let p3_rotation_coef = 2 * Math.PI * t / 11;
            let p3_rotation = Mat4.rotation(p3_rotation_coef, Vec.of(0, 1, 0));
            let p3_axis_rotation = Mat4.rotation( Math.PI * t, Vec.of(1,1,0));

            model_transform = model_transform.times(p3_rotation).times(p3_translation).times(p3_axis_rotation);



            this.shapes.planet3.draw(graphics_state, model_transform, this.materials.plan3);
            this.planet_3 = model_transform;

            let ring_scale = Mat.of(
                [1,0,0,0],
                [0,1,0,0],
                [0,0,0.0005,0],
                [0,0,0,1],
            );

            model_transform = model_transform.times(ring_scale);

            this.shapes.ring.draw(graphics_state, model_transform, this.materials.plan3);


            // TODO: PLANET 4

            model_transform = Mat4.identity();
            let p4_translation_coef = 14;
            let p4_translation = Mat4.translation([p4_translation_coef, 0, 0]);

            let p4_rotation_coef = 2 * Math.PI * t / 14;
            let p4_rotation = Mat4.rotation(p4_rotation_coef, Vec.of(0, 1, 0));

            model_transform = model_transform.times(p4_rotation).times(p4_translation);

            this.shapes.planet4.draw(graphics_state, model_transform, this.materials.plan4);
            this.planet_4 = model_transform;

            let moon_translation = Mat4.translation([0, 2, 0]);
            let moon_rotation = Mat4.rotation(Math.PI * t * 3, Vec.of(1,0,1));

            model_transform = model_transform.times(moon_rotation);
            model_transform = model_transform.times(moon_translation);
            //model_transform = model_transform.times(moon_rotation);



            this.shapes.moon.draw(graphics_state, model_transform, this.materials.plan1);
            this.moon = model_transform;

            let camera_matrix = this.attached();
            if (camera_matrix === this.initial_camera_location)
                graphics_state.camera_transform = Mat4.inverse(camera_matrix)
                // .map((x, idx) => Vec.from(graphics_state.camera_transform[idx]).mix(x, 0.1))
                ;
            else {
                camera_matrix = camera_matrix.times(Mat4.translation([0, 0, 5]));
                graphics_state.camera_transform = Mat4.inverse(camera_matrix)
                // .map((x, idx) => Vec.from(graphics_state.camera_transform[idx]).mix(x, .1));
            }
            */
            


        }
    };


// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
    class Ring_Shader extends Shader {
        // Subclasses of Shader each store and manage a complete GPU program.
        material() {
            // Materials here are minimal, without any settings.
            return {shader: this}
        }

        map_attribute_name_to_buffer_name(name) {
            // The shader will pull single entries out of the vertex arrays, by their data fields'
            // names.  Map those names onto the arrays we'll pull them from.  This determines
            // which kinds of Shapes this Shader is compatible with.  Thanks to this function,
            // Vertex buffers in the GPU can get their pointers matched up with pointers to
            // attribute names in the GPU.  Shapes and Shaders can still be compatible even
            // if some vertex data feilds are unused.
            return {object_space_pos: "positions"}[name];      // Use a simple lookup table.
        }

        // Define how to synchronize our JavaScript's variables to the GPU's:
        update_GPU(g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl) {
            const proj_camera = g_state.projection_transform.times(g_state.camera_transform);
            // Send our matrices to the shader programs:
            gl.uniformMatrix4fv(gpu.model_transform_loc, false, Mat.flatten_2D_to_1D(model_transform.transposed()));
            gl.uniformMatrix4fv(gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(proj_camera.transposed()));
        }

        shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        {
            return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
        }

        vertex_glsl_code()           // ********* VERTEX SHADER *********
        {
            return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        { 
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        }

        fragment_glsl_code()           // ********* FRAGMENT SHADER *********
        {
            return `
        void main()
        { 
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        }
    };

window.Grid_Sphere = window.classes.Grid_Sphere =
    class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at
    {
        constructor(rows, columns, texture_range)             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
        {
            super("positions", "normals", "texture_coords");
            // TODO:  Complete the specification of a sphere with lattitude and longitude lines
            //        (Extra Credit Part III)
        }
    };
