<?php get_header(); ?>

<section class="page-content fade-in visible" style="padding-top: 150px;">
    <div class="section-header">
        <h2><?php the_title(); ?></h2>
    </div>
    
    <div class="glass-card" style="max-width: 800px; margin: 0 auto; text-align: left; padding: 40px; margin-bottom: 50px;">
        <div style="color: var(--text-main);">
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
