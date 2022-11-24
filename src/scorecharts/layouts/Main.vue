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

        <OffcanvasComponent
            v-if="customer"
            :customer="customer"
        />
    </main>
</template>

<script>
import OffcanvasComponent from '../../components/scorecharts/Offcanvas.vue'

export default {
    components: {OffcanvasComponent},
    props: {
        customer: {
            type: Number,
            required: false,
        },
    },
}
</script>