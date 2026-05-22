<?php
function matrixpremium_enqueue_styles() {
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Inter:wght@300;400;600&display=swap', array(), null);
    wp_enqueue_style('matrixpremium-style', get_stylesheet_uri(), array(), '1.0.0');
    wp_enqueue_script('matrixpremium-script', get_template_directory_uri() . '/js/script.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'matrixpremium_enqueue_styles');

function matrixpremium_setup() {
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    register_nav_menus(array(
        'primary' => __('Menú Principal', 'matrixpremium')
    ));
}
add_action('after_setup_theme', 'matrixpremium_setup');
