import React, { Component } from "react";
import ReactDOM from "react-dom";
import $ from 'jquery'

const columns = [
{ title: "Name", data:'name' },
{ title: "Position", data:'position'  },
{ title: "Office", data:'office' },
{ title: "Extn.", data: 'ext' },
{ title: "Start date", data:"date" },

];
class DataTableComp extends Component {
  constructor(props) {
       super(props);
    }
 componentDidMount() {
      this.$el = $(this.el);
      this.$el.DataTable({
             dom: '<"data-table-wrapper">',
             data: this.props.data,
             columns: columns,
             ordering: false,
             language: {
                lengthMenu: 'MENU bản ghi trên trang',
                search: '<i class="fa fa-search"></i>',
                searchPlaceholder: 'Search',
              },
              "searching": true,
              "filter": true,
             columnDefs: [
                      {
                     targets: [4],
                   
                     className: "center",
                     
                      },],
                         });
                      }
componentWillUnmount() {
    $(".data-table-wrapper").find("table").DataTable().destroy(true);
    }
reloadTableData = (data) => {
        const table = $('.data-table-wrapper').find('table').DataTable();
     table.clear();
     table.rows.add(data);
     table.draw();
      }
shouldComponentUpdate(nextProps, nextState){
if (nextProps.data.length !== this.props.data.length) {
       this.reloadTableData(nextProps.data);
          }
   return false;
    }
render() {
     return (
       <div>
         <table className="table table-borderless display"
                   id="dataTable"
                    width="100%"
                    cellSpacing="0"
                    ref={(el) => (this.el = el)}
                     />
                </div>
             );
       }
}
export default DataTableComp;