(function ($) {
    var _productService = abp.services.app.product,
        _categoryService = abp.services.app.category,
        l = abp.localization.getSource('SimpleTaskApp'),
        _$modal = $('#ProductEditModal'),
        _$form = _$modal.find('form');

    // Validate form
    _$form.validate({
        rules: {
            Name: {
                required: true,
                minlength: 3
            },
            Price: {
                required: true,
                number: true,
                min: 0
            },
            StockQuantity: {
                required: true,
                digits: true,
                min: 0
            }
        },
        messages: {
            Name: {
                required: "Vui lòng nhập tên sản phẩm",
                minlength: "Tên sản phẩm phải có ít nhất 3 kí tự"
            },
            Price: {
                required: "Vui lòng nhập giá",
                number: "Giá phải là số",
                min: "Giá phải lớn hơn hoặc bằng 0"
            },
            StockQuantity: {
                required: "Vui lòng nhập số lượng",
                digits: "Số lượng phải là số nguyên",
                min: "Số lượng phải >= 0"
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

    // Gửi dữ liệu lưu sản phẩm
    function save() {
        if (!_$form.valid()) {
            return;
        }

        var formData = new FormData(_$form[0]);

        abp.ui.setBusy(_$modal);
        $.ajax({
            url: abp.appPath + 'api/services/app/product/UpdateProductData',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                // Cập nhật UI mà không cần tải lại trang
                var updatedProduct = response; // Dữ liệu trả về sau khi sửa thành công

                // Cập nhật các giá trị trong giao diện
                $('#ProductName_' + updatedProduct.id).text(updatedProduct.name);
                $('#ProductPrice_' + updatedProduct.id).text(updatedProduct.price);
                $('#ProductStock_' + updatedProduct.id).text(updatedProduct.stockQuantity);

                // Đóng modal và reset form
                _$modal.modal('hide');
                _$form[0].reset();

                abp.message.success('Cập nhật thông tin sản phẩm thành công');
                abp.event.trigger('product.edited');
            },
            error: function (xhr) {
                alert("Lỗi sửa thông tin sản phẩm: " + xhr.responseText);
            },
            complete: function () {
                abp.ui.clearBusy(_$modal);
            }
        });
    }

    // Bắt sự kiện khi click nút lưu
    _$form.closest('div.modal-content').find(".save-button").click(function (e) {
        e.preventDefault();
        save();
    });

    // Bắt sự kiện nhấn Enter để submit
    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            save();
        }
    });

    abp.event.on('category.edited', function () {
        $('#CategoriesTable').DataTable().ajax.reload();
    });

})(jQuery);
