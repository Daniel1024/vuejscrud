
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

//Vue.component('example', require('./components/Example.vue'));

new Vue({
    el: '#manage-vue',
    data: {
        items: [],
        pagination: {
            total: 0,
            per_page: 2,
            from: 1,
            to: 0,
            current_page: 1,
            last_page: 1
        },
        offset: 4,
        formErrors: {},
        formErrorsUpdate: {},
        newItem: {'title':'', 'description':''},
        fillItem: {'title':'', 'description':''}
    },
    computed: {
        isActived: function() {
            return this.pagination.current_page;
        },
        pagesNumber: function () {
            if (!this.pagination.to) {
                return [];
            }

            let from = this.pagination.current_page - this.offset;
            if (from < 1) {
                from = 1;
            }

            let to = from + (this.offset + 2);
            if (to >= this.pagination.last_page) {
                to = this.pagination.last_page;
            }

            let pagesArray = [];
            while (from <= to) {
                pagesArray.push(from);
                from++;
            }

            return pagesArray;
        }
    },
    mounted: function () {
        this.getVueItems(this.pagination.current_page);
    },
    methods: {
        getVueItems: function (page) {
            axios.get('/vueitems?page='+page).then(response => {
                this.items = response.data.data.data;
                this.pagination = response.data.pagination;
            });
        },
        createItem: function () {
            let input = this.newItem;
            axios.post('/vueitems', input).then(() => {
                this.changePage(this.pagination.current_page);
                this.newItem = {'title':'', 'description':''};
                $('#create-item').modal('hide');
                toastr.success('Post Created Successfully.', 'Success Alert', {timeOut: 5000});
            }).catch(response => {
                this.formErrors = response.data;
            });
        },
        deleteItem: function (item) {
            axios.delete('/vueitems/'+item.id).then(() => {
                this.changePage(this.pagination.current_page);
                toastr.success('Post Deleted Successfully.', 'Success Alert', {timeOut: 5000});
            });
        },
        editItem: function (item) {
            this.fillItem.title = item.title;
            this.fillItem.id = item.id;
            this.fillItem.description = item.description;
            $('#edit-item').modal('show');
        },
        updateItem: function (id) {
            let input = this.fillItem;
            axios.put('/vueitems/'+id, input).then(() => {
                this.changePage(this.pagination.current_page);
                this.newItem = {'title':'', 'description':'', 'id':''};
                $('#edit-item').modal('hide');
                toastr.success('Item Updated Successfully.', 'Success Alert', {timeOut: 5000});
            }).catch(response => {
                this.formErrors = response.data;
            });
        },
        changePage: function (page) {
            this.pagination.current_page = page;
            this.getVueItems(page);
        }
    }
});
