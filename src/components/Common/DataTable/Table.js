import React, { Component } from "react";
import DataTablesComp from "./DataTable";
class Table extends Component {
constructor(props) {
        super(props);
        const dataSet = [
        {
              id: 1,
              name: "Tiger Nixon",
              position: "System Architect",
              office: "Edinburgh",
              ext: 5421,
              date: "2011/04/25",
              
        },
      {
              id: 2,
              name: "Garrett Winters",
              position: "Accountant",
              office: "Tokyo",
              ext: 8422,
              date: "2011/07/25",
             
       },
       {
              id: 3,
              name: "Ashton Cox",
              position: "Junior Technical Author",
              office: "San Francisco",
              ext: 1562,
              date: "2009/01/12",
             
        },
    ];
this.state = {
         data: dataSet
    };
}
deleteRow = (id) => {
  const filteredData = this.state.data.filter((i) =>  i.id !== id);
  this.setState({data: filteredData});
};
render() {
   return (
       <div>
        <DataTablesComp columns={this.columns} data={this.state.data} deleteRow={this.deleteRow} gotoEdit={this.gotoEdit} />
    </div>
      );
    }
}
export default Table;