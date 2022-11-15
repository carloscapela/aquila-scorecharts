<template>
    <main>
        <!-- Header -->
        <slot name="header"></slot>

        <div class="container-fluid mt-3">
            <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-9">
                    <!-- Content -->
                    <slot name="content"></slot>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-3">
                    <!-- Sidebar -->
                    <slot name="sidebar"></slot>
                </div>
            </div>
        </div>
        <!-- <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasScrollingLabel">Offcanvas with body scrolling</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <p>Try scrolling the rest of the page to see this option in action.</p>
            </div>
        </div> -->
    </main>
</template>

<script>
    // export default {
    //     props: {
    //         title: '',
    //     },
    // }
</script>