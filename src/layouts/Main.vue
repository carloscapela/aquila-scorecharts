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
    </main>
</template>

<script>
    // export default {
    //     props: {
    //         title: '',
    //     },
    // }
</script>