(function ($) {
    var _productAppService = abp.services.app.product,
        l = abp.localization.getSource('SimpleTaskApp'),
        _$modal = $('#ProductCreateModal'),
        _$form = _$modal.find('form'),
        _$table = $('#ProductsTable');

    console.log(_productAppService);
    var _$productsTable = _$table.DataTable({
        paging: true,
        ordering: true,
        serverSide: true,
        listAction: {
            ajaxFunction: _productAppService.getAll,
            inputFilter: function () {
                var filter = $('#ProductsSearchForm').serializeFormToObject(true);

                var dataTable = _$table.DataTable();
                var order = dataTable.order(); // ví dụ: [[0, 'asc']]
                if (order.length > 0) {
                    var columnIndex = order[0][0];
                    var direction = order[0][1]; // 'asc'/ 'desc'
                    var sortField = dataTable.column(columnIndex).dataSrc(); // lay ten data cot set ở columnDefs

                    filter.sorting = sortField + ' ' + direction;
                }
                console.log('Dữ liệu gửi đi:', filter);  // Kiểm tra giá trị filter
                return filter;
            }
        },
        buttons: [
            {
                name: 'refresh',
                text: '<i class="fas fa-redo-alt"></i>',
                action: () => _$productsTable.draw(false)
            }
        ],
        responsive: {
            details: {
                type: 'column'
            }
        },
        columnDefs: [
            { targets: 0, className: 'control', defaultContent: '' },
            { targets: 1, data: 'name'},
            {
                targets: 2, data: 'images', sortable: false, render: data => `<div class="text-center">
            <img src="${data}" class="img-thumbnail product-img" alt="Product Image">
        </div>` },
            { targets: 3, data: 'price', render: data => `${new Intl.NumberFormat('vi-VN').format(data)} VNĐ` },
            { targets: 4, data: 'stockQuantity' },
            { targets: 5, data: 'description', },
            {
                targets: 6, 
                data: 'creationTime',
                
                render: function (data) {
                    return data ? new Date(data).toLocaleString('vi-VN') : '';
                }
            },
            {
                targets: 7, data: 'lastModificationTime',
                render: function (data) {
                    return data ? new Date(data).toLocaleString('vi-VN') : '';
                }
            },
            {
                targets: 8,
                data: null,
                sortable: false,
                render: (data, type, row, meta) => {
                    return [
                        `   <button type="button" class="btn btn-sm bg-secondary edit-product" data-product-id="${row.id}" data-toggle="modal" data-target="#ProductEditModal">`,
                        `       <i class="fas fa-pencil-alt"></i> ${('Sửa')}`,
                        '   </button>',
                        `   <button type="button" class="btn btn-sm bg-danger delete-product" data-product-id="${row.id}" data-product-name="${row.productName}">`,
                        `       <i class="fas fa-trash"></i> ${('Xoá')}`,
                        '   </button>'
                    ].join('');
                }
            }
        ]
    });




    $.validator.addMethod("fileImageOnly", function (value, element) {
        if (element.files && element.files.length > 0) {
            const fileName = element.files[0].name;
            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
            return allowedExtensions.test(fileName);
        }
        return false; 
    }, "Chỉ chấp nhận ảnh định dạng JPG, JPEG, PNG");


    var _$form = $('form[name="productCreateForm"]');

    _$form.validate({
        rules: {
            Name: {
                required: true
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
            },
            Images: {
                required: true,
                fileImageOnly: true
            }
        },
        messages: {
            Name: {
                required: "Vui lòng nhập tên sản phẩm"
            },
            Price: {
                required: "Vui lòng nhập giá",
                number: "Giá phải là số",
                min: "Giá không được âm"
            },
            StockQuantity: {
                required: "Vui lòng nhập số lượng",
                digits: "Phải là số nguyên",
                min: "Không được âm"
            },
            Images: {
                required: "vui lòng chọn ảnh",
                fileImageOnly: "chỉ nhận .jpg, .png, .jpeg"
            }
        }
    });

    _$form.find('.save-button').on('click', (e) => {
        e.preventDefault();

        if (!_$form.valid()) {
            return;
        }

        var formData = new FormData(_$form[0]);
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }
        abp.ui.setBusy(_$modal);

        $.ajax({
            url: abp.appPath + 'api/services/app/product/Create',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                _$modal.modal('hide');
                _$form[0].reset();
                abp.message.success('Lưu thành công');
                _$productsTable.ajax.reload();
            },
            error: function (xhr) {
                alert("Lỗi tạo sản phẩm: " + xhr.responseText);
            },
            complete: function () {
                abp.ui.clearBusy(_$modal);
            }
        });
    });

    $(document).on('click', '.delete-product', function () {
        var productId = $(this).attr("data-product-id");
        var productName = $(this).attr('data-product-name');

        abp.message.confirm(
            abp.utils.formatString('Xác nhận Xoá ?'),
            null,
            (isConfirmed) => {
                if (isConfirmed) {
                    _productAppService.delete({ id: productId }).done(() => {
                        abp.message.success(l('Xoá thành công'));
                        _$productsTable.ajax.reload();
                    });
                }
            }
        );
    });

    $(document).on('click', '.edit-product', function (e) {
        var productId = $(this).attr("data-product-id");

        e.preventDefault();
        abp.ajax({
            url: abp.appPath + 'Products/EditModal?productId=' + productId,
            type: 'POST',
            dataType: 'html',
            success: function (content) {
                $('#ProductEditModal div.modal-content').html(content);
            }
        });
    });

    $('.btn-search').on('click', (e) => {
        _$productsTable.ajax.reload();
    });

    $('.txt-search').on('keypress', (e) => {
        if (e.which == 13) {
            _$productsTable.ajax.reload();
            return false;
        }
    });

    $('#ProductCreateModal').on('hidden.bs.modal', function () {
        var $form = $(this).find('form');
        $form[0].reset(); 
        $form.validate().resetForm(); 
        $form.find('.form-control').removeClass('is-invalid'); 
    });



    const style = `
    <style>
        .product-img {
            width: 90px;
            height: 80px;
            object-fit: contains;
            border-radius: 8px;
            transition: transform 0.3s ease;
        }

        .dataTables_wrapper td,
        .dataTables_wrapper th {
            vertical-align: middle;
            text-align: center;
        }

        .text-center {
            text-align: center;
        }
    </style>
`;
    $('head').append(style);

}) (jQuery);
