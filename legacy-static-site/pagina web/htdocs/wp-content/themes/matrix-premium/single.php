<?php get_header(); ?>

<section class="page-content fade-in visible" style="padding-top: 150px; min-height: 80vh;">
    <div class="glass-card" style="max-width: 800px; margin: 0 auto; text-align: left; padding: 40px; margin-bottom: 50px;">
        <h1 style="color: var(--accent); margin-bottom: 10px;"><?php the_title(); ?></h1>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 30px; border-bottom: 1px solid var(--glass-border); padding-bottom: 15px;">
            Publicado el <?php echo get_the_date(); ?> por <?php the_author(); ?>
        </p>
        
        <div style="color: var(--text-main); font-size: 1.1rem; line-height: 1.8;">
            <?php
            if ( have_posts() ) :
                while ( have_posts() ) : the_post();
                    the_content();
                endwhile;
            endif;
            ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
