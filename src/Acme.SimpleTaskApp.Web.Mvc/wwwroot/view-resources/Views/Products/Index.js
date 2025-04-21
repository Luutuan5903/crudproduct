(function ($) {
  var _productAppService = abp.services.app.product,
    l = abp.localization.getSource("SimpleTaskApp"),
    _$modal = $("#ProductCreateModal"),
    _$form = _$modal.find("form"),
    _$table = $("#ProductsTable");

  console.log(_productAppService);
  var _$productsTable = _$table.DataTable({
    paging: true,
    ordering: true,
    serverSide: true,
    processing: true,
    listAction: {
      ajaxFunction: _productAppService.getAll,
      inputFilter: function () {
        // Lấy dữ liệu từ form tìm kiếm
        var searchForm = $("#ProductsSearchForm").serializeFormToObject(true);

        // Lấy dữ liệu từ form lọc
        var filterForm = $("#FilterForm").serializeFormToObject(true);

        // Kết hợp dữ liệu từ cả hai form
        var filter = {
          ...searchForm,
          ...filterForm,
        };

        // Xử lý giá trị số cho khoảng giá
        if (filter.MinPrice) {
          filter.MinPrice = parseFloat(filter.MinPrice);
        }
        if (filter.MaxPrice) {
          filter.MaxPrice = parseFloat(filter.MaxPrice);
        }

        // Xử lý giá trị ngày tháng cho khoảng thời gian tạo
        if (filter.CreationTimeFrom) {
          filter.CreationTimeFrom = new Date(
            filter.CreationTimeFrom
          ).toISOString();
        }
        if (filter.CreationTimeTo) {
          filter.CreationTimeTo = new Date(filter.CreationTimeTo).toISOString();
        }

        // Xử lý sắp xếp
        var dataTable = _$table.DataTable();
        var order = dataTable.order();
        if (order.length > 0) {
          var columnIndex = order[0][0];
          var direction = order[0][1];
          var sortField = dataTable.column(columnIndex).dataSrc();
          filter.sorting = sortField + " " + direction;
        }

        console.log("Dữ liệu gửi đi:", filter);
        return filter;
      },
    },
    buttons: [
      {
        name: "refresh",
        text: '<i class="fas fa-redo-alt"></i>',
        action: () => _$productsTable.draw(false),
      },
    ],
    responsive: {
      details: {
        type: "column",
      },
    },
    columnDefs: [
      { targets: 0, className: "control", defaultContent: "" },
      { targets: 1, data: "name" },
      {
        targets: 2,
        data: "images",
        sortable: false,
        render: function (data) {
          if (!data) return "";
          return `<div class="text-center">
            <img src="${data}" class="img-thumbnail product-img" alt="Product Image">
          </div>`;
        },
      },
      {
        targets: 3,
        data: "price",
        render: function (data) {
          if (!data) return "";
          return `${new Intl.NumberFormat("vi-VN").format(data)} VNĐ`;
        },
      },
      { targets: 4, data: "stockQuantity" },
      { targets: 5, data: "description" },
      {
        targets: 6,
        data: "creationTime",
        render: function (data) {
          if (!data) return "";
          return new Date(data).toLocaleString("vi-VN");
        },
      },
      {
        targets: 7,
        data: "lastModificationTime",
        render: function (data) {
          if (!data) return "";
          return new Date(data).toLocaleString("vi-VN");
        },
      },
      { targets: 8, data: "categoryName", sortable: false },
      {
        targets: 9,
        data: null,
        sortable: false,
        render: function (data, type, row) {
          return [
            `   <button type="button" class="btn btn-sm bg-secondary edit-product" data-product-id="${row.id}" data-toggle="modal" data-target="#ProductEditModal">`,
            `       <i class="fas fa-pencil-alt"></i> ${l("Edit")}`,
            "   </button>",
            `   <button type="button" class="btn btn-sm bg-danger delete-product" data-product-id="${row.id}" data-product-name="${row.name}">`,
            `       <i class="fas fa-trash"></i> ${l("Delete")}`,
            "   </button>",
          ].join("");
        },
      },
    ],
  });

  // Add error handling for DataTable
  _$productsTable.on("xhr.dt", function (e, settings, json, xhr) {
    console.log("DataTable response:", json);
    if (xhr && xhr.status !== 200) {
      console.error("DataTable error:", xhr.responseText);
      abp.message.error("Có lỗi xảy ra khi tải dữ liệu");
    }
  });

  // Add error handling for AJAX requests
  $(document).ajaxError(function (event, jqXHR, settings, error) {
    console.error("AJAX error:", error);
    console.error("Response:", jqXHR.responseText);
    abp.message.error("Có lỗi xảy ra khi gọi API");
  });

  $.validator.addMethod(
    "fileImageOnly",
    function (value, element) {
      if (element.files && element.files.length > 0) {
        const fileName = element.files[0].name;
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        return allowedExtensions.test(fileName);
      }
      return false;
    },
    "Chỉ chấp nhận ảnh định dạng JPG, JPEG, PNG"
  );

  var _$form = $('form[name="productCreateForm"]');

  _$form.validate({
    rules: {
      Name: {
        required: true,
      },
      Price: {
        required: true,
        number: true,
        min: 0,
      },
      StockQuantity: {
        required: true,
        digits: true,
        min: 0,
      },
      Images: {
        required: true,
        fileImageOnly: true,
      },
      Description: {
        required: true,
        minlength: 5,
      },
      CategoryId: {
        required: true,
      },
    },
    messages: {
      Name: {
        required: "Vui lòng nhập tên sản phẩm",
      },
      Price: {
        required: "Vui lòng nhập giá",
        number: "Giá phải là số",
        min: "Giá không được âm",
      },
      StockQuantity: {
        required: "Vui lòng nhập số lượng",
        digits: "Phải là số nguyên",
        min: "Không được âm",
      },
      Images: {
        required: "Vui lòng chọn ảnh",
        fileImageOnly: "Chỉ chấp nhận định dạng .jpg, .png, .jpeg",
      },
      Description: {
        required: "Vui lòng nhập mô tả",
        minlength: "Mô tả phải có ít nhất 5 ký tự",
      },
      CategoryId: {
        required: "Vui lòng chọn danh mục",
      },
    },
  });

  _$form.find(".save-button").on("click", (e) => {
    e.preventDefault();

    if (!_$form.valid()) {
      return;
    }

    var formData = new FormData(_$form[0]);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }
    abp.ui.setBusy(_$modal);

    $.ajax({
      url: abp.appPath + "api/services/app/product/Create",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function () {
        _$modal.modal("hide");
        _$form[0].reset();
        abp.message.success("Lưu thành công");
        _$productsTable.ajax.reload();
      },
      error: function (xhr) {
        alert("Lỗi tạo sản phẩm: " + xhr.responseText);
      },
      complete: function () {
        abp.ui.clearBusy(_$modal);
      },
    });
  });

  $(document).on("click", ".delete-product", function () {
    var productId = $(this).attr("data-product-id");
    var productName = $(this).attr("data-product-name");

    abp.message.confirm(
      abp.utils.formatString("Xác nhận Xoá ?"),
      null,
      (isConfirmed) => {
        if (isConfirmed) {
          _productAppService.delete({ id: productId }).done(() => {
            abp.message.success(l("Xoá thành công"));
            _$productsTable.ajax.reload();
          });
        }
      }
    );
  });

  $(document).on("click", ".edit-product", function (e) {
    var productId = $(this).attr("data-product-id");

    e.preventDefault();
    abp.ajax({
      url: abp.appPath + "Products/EditModal?productId=" + productId,
      type: "POST",
      dataType: "html",
      success: function (content) {
        $("#ProductEditModal div.modal-content").html(content);

        // Sau khi modal được tải, xử lý select category
        var selectedCategoryId = $("#EditCategoryId").data(
          "selected-category-id"
        );
        if (selectedCategoryId) {
          $("#EditCategoryId").val(selectedCategoryId); // Chọn đúng category
        }
      },
    });
  });

  // Truyền dữ liệu categoryId vào trong modal khi gọi
  function setSelectedCategory(categoryId) {
    $("#EditCategoryId").data("selected-category-id", categoryId);
  }

  $("#ProductCreateModal").on("hidden.bs.modal", function () {
    var $form = $(this).find("form");
    $form[0].reset();
    $form.validate().resetForm();
    $form.find(".form-control").removeClass("is-invalid");
  });

  var _categoryService = abp.services.app.category;
  var abc = _categoryService.getAll;
  //console.log("---",abc);

  _categoryService.getAll({ keyword: "" }).done(function (data) {
    console.log(data);
    var categorySelect = $("#CreateCategoryId");

    data.items.forEach(function (category) {
      categorySelect.append(
        $("<option/>", {
          value: category.id,
          text: category.name,
        })
      );
    });
  });

  abp.event.on("product.edited", function () {
    $("#ProductsTable").DataTable().ajax.reload(null, false);
  });

  $(".btn-search").on("click", function (e) {
    _$productsTable.ajax.reload();
  });

  $(".txt-search").on("keypress", function (e) {
    if (e.which == 13) {
      _$productsTable.ajax.reload();
      return false;
    }
  });

  // Xử lý sự kiện submit form lọc
  $("#FilterForm").on("submit", function (e) {
    e.preventDefault();
    _$productsTable.ajax.reload();
    $("#filterCollapse").collapse("hide");
  });

  // Xử lý sự kiện reset form lọc
  function resetFilters() {
    // Reset giá
    document.querySelector('input[name="MinPrice"]').value = "";
    document.querySelector('input[name="MaxPrice"]').value = "";

    // Reset ngày
    document.querySelector('input[name="CreationTimeFrom"]').value = "";
    document.querySelector('input[name="CreationTimeTo"]').value = "";

    // Reload bảng
    _$productsTable.ajax.reload();
  }

  // Xử lý đóng form lọc
  $(".filter-close").on("click", function () {
    $("#filterCollapse").collapse("hide");
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
  $("head").append(style);
})(jQuery);
