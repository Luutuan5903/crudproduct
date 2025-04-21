(function ($) {
    var _categoryService = abp.services.app.category,
        l = abp.localization.getSource('SimpleTaskApp');

    // Khi click vào nút sửa danh mục
    $(document).on('click', '[data-toggle="edit-category-modal"]', function (e) {
        e.preventDefault();
        var categoryId = $(this).data('category-id');
        var modal = $('#CategoryEditModal');

        abp.ajax({
            url: abp.appPath + 'Category/EditModal?categoryId=' + categoryId,
            type: 'GET',
            success: function (result) {
                modal.find('.modal-content').html(result);


                modal.modal({
                    backdrop: 'static',
                    keyboard: false
                });
            },
            error: function () {
                abp.message.success(l('CouldNotLoadCategoryData'));
            }
        });
    });
    

    // Khi ấn Save trong modal sửa danh mục
    $(document).on('submit', 'form[name=CategoryEditForm]', function (e) {
        e.preventDefault();

        var $form = $(this);

       
        $form.validate({
            rules: {
                NameCategory: {
                    required: true,
                    minlength: 3
                }
            },
            messages: {
                NameCategory: {
                    required: "Vui lòng nhập tên danh mục",
                    minlength: "Tên danh mục phải có ít nhất 3 ký tự"
                }
            },
            errorElement: 'span',
            errorClass: 'text-danger',
            highlight: function (element) {
                $(element).addClass('is-invalid');
            },
            unhighlight: function (element) {
                $(element).removeClass('is-invalid');
            }
        });

        if (!$form.valid()) {
            return;
        }

        var id = $form.find('input[name="Id"]').val();
        var name = $form.find('input[name="NameCategory"]').val();

        var categoryData = {
            id: id,
            name: name
        };

        abp.ui.setBusy($form);

        _categoryService.updateCategory(categoryData)
            .done(function () {
                abp.message.success(l('Cập nhật sản phẩm thành công!'));
                $('#CategoryEditModal').modal('hide');
                $('#CategoriesTable').DataTable().ajax.reload();
            })
            .fail(function (error) {
                abp.notify.error(l('ErrorOccurred') + ": " + (error.message || ''));
                console.error(error);
            })
            .always(function () {
                abp.ui.clearBusy($form);
            });
    });


})(jQuery);
