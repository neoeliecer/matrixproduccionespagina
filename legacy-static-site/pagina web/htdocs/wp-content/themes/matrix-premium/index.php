<?php get_header(); ?>

<section class="page-content fade-in visible" style="padding-top: 150px; min-height: 80vh;">
    <div class="section-header">
        <h2>Nuestro Blog</h2>
        <p>Noticias, reflexiones y actualizaciones sobre nuestros proyectos</p>
    </div>
    
    <div class="portafolio-grid">
        <?php
        if ( have_posts() ) :
            while ( have_posts() ) : the_post(); ?>
                <article class="portafolio-card">
                    <h3><a href="<?php the_permalink(); ?>" style="color: var(--accent); text-decoration: none;"><?php the_title(); ?></a></h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;"><?php echo get_the_date(); ?></p>
                    <div style="color: var(--text-main);">
                        <?php the_excerpt(); ?>
                    </div>
                    <a href="<?php the_permalink(); ?>" class="btn-propuesta" style="display: inline-block; margin-top: 15px; font-size: 0.85rem;">Leer más</a>
                </article>
            <?php endwhile;
        else :
            echo '<p style="text-align:center; grid-column: 1 / -1; color: var(--text-muted);">Próximamente publicaremos nuevos artículos.</p>';
        endif;
        ?>
    </div>
</section>

<?php get_footer(); ?>
