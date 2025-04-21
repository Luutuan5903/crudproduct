(function ($) {
    var _categoryService = abp.services.app.category,
        l = abp.localization.getSource('SimpleTaskApp'),
        _$table = $('#CategoriesTable');

    var _$categoriesTable = _$table.DataTable({
        paging: true,
        serverSide: true,
        processing: true,
        listAction: {
            ajaxFunction: _categoryService.getAll,
            inputFilter: function () {
                return $('#CategoriesSearchForm').serializeFormToObject(true);
            }
        },
        buttons: [
            {
                name: 'refresh',
                text: '<i class="fas fa-redo-alt"></i>',
                className: 'btn btn-sm btn-secondary',
                action: () => _$categoriesTable.draw(false)
            }
        ],
        responsive: {
            details: {
                type: 'column'
            }
        },
        columnDefs: [
            {
                targets: 0,
                className: 'control',
                defaultContent: ''
            },
            {
                targets: 1,
                data: 'name',
                className: 'text-center',
                sortable: false
            },
            {
                targets: 2,
                data: 'creationTime',
                className: 'text-center',
                render: function (data) {
                    return data ? new Date(data).toLocaleString('vi-VN') : '';
                }
            },
            {
                targets: 3,
                data: 'lastModificationTime',
                className: 'text-center',
                render: function (data) {
                    return data ? new Date(data).toLocaleString('vi-VN') : '';
                }
            },
            {
                targets: 4,
                data: null,
                sortable: false,
                className: 'text-center',
                render: function (data, type, row) {
                    return ` 
                        <button type="button" class="btn btn-sm btn-secondary edit-category" data-category-id="${row.id}" data-toggle="modal" data-target="#CategoryEditModal">
                            <i class="fas fa-pencil-alt"></i> ${l('Edit')}
                        </button>
                        <button type="button" class="btn btn-sm btn-danger delete-category" data-category-id="${row.id}" data-category-name="${row.name}">
                            <i class="fas fa-trash"></i> ${l('Delete')}
                        </button>`;
                }
            }
        ]
    });

    $('form[name="categoryCreateForm"]').validate({
        rules: {
            Id: {
                required: true,
                minlength: 2,
                
            },
            Name: {
                required: true,
                minlength: 3,
                
            }
        },
        messages: {
            Id: {
                required: "Vui lòng nhập mã danh mục",
                minlength: "Mã danh mục phải có ít nhất 2 ký tự"
                
            },
            Name: {
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


    
    $(document).on('click', '.delete-category', function () {
        var categoryId = $(this).attr("data-category-id");
        var categoryName = $(this).attr('data-category-name');

        deleteCategories(categoryId, categoryName);
    });

    function deleteCategories(categoryId, categoryName) {
        abp.message.confirm(
            abp.utils.formatString(
                l('AreYouSureWantToDelete'),
                categoryName),
            null,
            (isConfirmed) => {
                if (isConfirmed) {
                    _categoryService.delete({
                        id: categoryId
                    }).done(() => {
                        abp.message.success(l('SuccessfullyDeleted'));
                        _$categoriesTable.ajax.reload();
                    });
                }
            }
        );
    }

    $(document).on('click', '.edit-category', function (e) {
        var categoryId = $(this).attr('data-category-id');

        e.preventDefault();
        abp.ajax({
            url: abp.appPath + 'Category/EditModal?categoryId=' + categoryId,
            type: 'POST',
            dataType: 'html',
            success: function (content) {
                
                $('#CategoryEditModal .modal-content').html(content);

                $('#CategoryEditModal').modal('show');
            },
            error: function (e) {
                abp.notify.error('Không thể tải form chỉnh sửa');
            }
        });
    });



    // Xử lý tạo mới danh mục
    $(document).on('submit', 'form[name="categoryCreateForm"]', function (e) {
        e.preventDefault();

        var $form = $(this);
        var categoryData = {
            id: $form.find('input[name="Id"]').val(),
            name: $form.find('input[name="Name"]').val()
        };

        if (!categoryData.id || !categoryData.name) {
            abp.notify.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        abp.ui.setBusy($form);
        abp.services.app.category.createCategory(categoryData)
            .done(function () {
                abp.message.success('Danh mục đã được tạo thành công');
                $('#CategoryCreateModal').modal('hide');
                $form[0].reset();
                $('#CategoriesTable').DataTable().ajax.reload();
            })
            .fail(function (error) {
                abp.notify.error('Đã xảy ra lỗi: ' + (error.message || 'Không rõ nguyên nhân'));
            })
            .always(function () {
                abp.ui.clearBusy($form);
            });
    });

    $('.btn-search').on('click', function (e) {
        _$categoriesTable.ajax.reload();
    });


    $('.txt-search').on('keypress', function (e) {
        if (e.which == 13) {
            _$categoriesTable.ajax.reload();
            return false;
        }
    });


})(jQuery);
