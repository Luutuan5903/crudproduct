(function ($) {
    var _productService = abp.services.app.product,
        l = abp.localization.getSource('SimpleTaskApp'),
        _$modal = $('#ProductEditModal'),
        _$form = _$modal.find('form');

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
                maxlength: "Tên sản phẩm có ít nhất 3 kí tự"
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
    function save() {
        if (!_$form.valid()) {
            return;
        }

        var formData = new FormData(_$form[0]);

        // Kiểm tra tất cả dữ liệu trong formData
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }

        abp.ui.setBusy(_$modal);
        $.ajax({
            url: abp.appPath + 'api/services/app/product/UpdateProductData',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
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


    _$form.closest('div.modal-content').find(".save-button").click(function (e) {
        e.preventDefault();
        save();
    });

    _$form.find('input').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            save();
        }
    });

    $(document).on("click", ".view-image-btn", function () {
        var imageUrl = $(this).data("image");
        console.log("Image URL:", imageUrl);

        // Hiển thị ảnh trong modal
        $("#imageModal img").attr("src", imageUrl);
        $("#imageModal").modal("show");
    });

    abp.event.on('product.edited', function () {
        $('#ProductsTable').DataTable().ajax.reload();
    });


    

})(jQuery);
