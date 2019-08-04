<template>
  <div class="dialog">
    <el-dialog :title="dialog.title" :visible.sync="dialog.show">
      <el-form
        ref="form"
        :model="formData"
        :rules="form_rules"
        label-width="120px"
        style="margin:10px; width:auto"
      >
        <el-form-item label="收支类型">
          <el-select v-model="formData.type" placeholder="收支类型">
            <el-option
              v-for="(formtype,index) in form_type_list"
              :key="index"
              :label="formtype"
              :value="formtype"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="describe" label="收支描述">
          <el-input type="describe" v-model="formData.describe"></el-input>
        </el-form-item>

        <el-form-item prop="income" label="收入">
          <el-input type="income" v-model="formData.income"></el-input>
        </el-form-item>

        <el-form-item prop="expend" label="支出">
          <el-input type="expend" v-model="formData.expend"></el-input>
        </el-form-item>

        <el-form-item prop="cash" label="现金">
          <el-input type="cash" v-model="formData.cash"></el-input>
        </el-form-item>

        <el-form-item label="备注:">
          <el-input type="textarea" v-model="formData.remark"></el-input>
        </el-form-item>

        <el-form-item class="text-right">
          <el-button @click="dialog.show=false">取消</el-button>
          <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 收支类型遍历的数组
      form_type_list: [
        "提现",
        "提现手续费",
        "充值",
        "优惠券",
        "充值礼券",
        "转账"
      ],
      form_rules: {
        describe: [
          { required: true, message: "收支描述不能为空", triggle: "blur" }
        ],
        income: [{ required: true, message: "收入不能为空", triggle: "blur" }],
        expend: [{ required: true, message: "支出不能为空", triggle: "blur" }],
        cash: [{ required: true, message: "账户不能为空", triggle: "blur" }]
      }
    };
  },
  props: {
    dialog: Object,
    formData: Object
  },
  methods: {
    onSubmit: function(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const url = this.dialog.option == "add" ? "add" : `edit/${this.formData.id}`;
          this.$axios.post(`/api/profile/${url}`, this.formData).then(
            res => {
              // console.log(res);
              this.$message({ message: "数据添加成功", type: "success" });
              this.dialog.show = false;
              // 父级执行updata
              this.$emit("update:fundlist");
            },
            err => {
              console.log(err);
            }
          );
        }
      });
    }
  }
};
</script>
