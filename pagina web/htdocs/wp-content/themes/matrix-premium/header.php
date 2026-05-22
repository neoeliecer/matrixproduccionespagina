<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<header>
  <div class="logo-container">
    <a href="<?php echo esc_url(home_url('/')); ?>">
        <img src="https://via.placeholder.com/150x50?text=Matrix+Producciones" alt="<?php bloginfo('name'); ?> Logo" id="logo">
    </a>
  </div>
  <nav>
    <div class="menu-toggle">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <?php
      if (has_nav_menu('primary')) {
          wp_nav_menu(array(
              'theme_location' => 'primary',
              'container' => false,
              'menu_class' => 'nav-links'
          ));
      } else {
          // Fallback menu si aún no han creado uno en WordPress
          echo '<ul class="nav-links">';
          echo '<li><a href="' . esc_url(home_url('/')) . '">Inicio</a></li>';
          echo '<li><a href="' . esc_url(home_url('/blog')) . '">Blog</a></li>';
          echo '</ul>';
      }
    ?>
  </nav>
</header>
<main>
