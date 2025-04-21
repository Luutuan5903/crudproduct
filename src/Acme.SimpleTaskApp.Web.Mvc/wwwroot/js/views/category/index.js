$(function () {
  var _categoryService = abp.services.simpleTaskApp.category;
  var _$modal = $("#CategoryCreateModal");
  var _$form = _$modal.find("form");

  function validateForm() {
    var isValid = true;
    var id = _$form.find('input[name="Id"]').val();
    var name = _$form.find('input[name="Name"]').val();

    // Reset error messages
    _$form.find(".field-validation-error").remove();
    _$form.find(".is-invalid").removeClass("is-invalid");

    // Validate Id
    if (!id) {
      isValid = false;
      _$form.find('input[name="Id"]').addClass("is-invalid");
      _$form
        .find('input[name="Id"]')
        .after(
          '<span class="field-validation-error text-danger">Vui lòng nhập mã danh mục</span>'
        );
    } else if (id.length < 2) {
      isValid = false;
      _$form.find('input[name="Id"]').addClass("is-invalid");
      _$form
        .find('input[name="Id"]')
        .after(
          '<span class="field-validation-error text-danger">Mã danh mục phải có ít nhất 2 ký tự</span>'
        );
    }

    // Validate Name
    if (!name) {
      isValid = false;
      _$form.find('input[name="Name"]').addClass("is-invalid");
      _$form
        .find('input[name="Name"]')
        .after(
          '<span class="field-validation-error text-danger">Vui lòng nhập tên danh mục</span>'
        );
    } else if (name.length < 3) {
      isValid = false;
      _$form.find('input[name="Name"]').addClass("is-invalid");
      _$form
        .find('input[name="Name"]')
        .after(
          '<span class="field-validation-error text-danger">Tên danh mục phải có ít nhất 3 ký tự</span>'
        );
    }

    return isValid;
  }

  _$modal.on("shown.bs.modal", function () {
    _$form.find('input[name="Id"]').focus();
  });

  _$form.find('button[type="submit"]').click(function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    var category = _$form.serializeFormToObject();

    abp.ui.setBusy(_$modal);
    _categoryService
      .createCategory(category)
      .done(function () {
        _$modal.modal("hide");
        location.reload();
        abp.notify.info("Tạo danh mục thành công!");
      })
      .always(function () {
        abp.ui.clearBusy(_$modal);
      });
  });

  _$modal.on("hidden.bs.modal", function () {
    _$form.clearForm();
  });
});
