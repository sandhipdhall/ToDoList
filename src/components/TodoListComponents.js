import React, { Component } from 'react';
import { View, Text,TouchableOpacity ,Button,Picker,Dimensions ,FlatList,StyleSheet} from 'react-native';
import Realm from 'realm';
import { Appbar,TextInput } from 'react-native-paper';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TaskListSchema = {
  name: 'TaskList',
   primaryKey: 'id',
  properties: {
    id:    'int', 
    Status: 'string',
    WorkType:  'string',
    WorkData:'string',
    Where: 'string',
    Time: 'string',
  }
};


export default class TodoListComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name:'sandhip',
        time:'12:00',
        data:[],
        isModalVisible: false,
         work:'All Things',
         date:"2016-05-15",
        taskdata :[],
    };
  }


        //opening and closing of modal popup
         toggleModal = () => {
            this.setState({isModalVisible: !this.state.isModalVisible});
        };

        //Type of Work Selection like business , personal etc
        updateWork = (work) => {
            this.setState({ work: work })
        }

         //Get Response from Realm storage
        getTaskData=()=>{
        Realm.open({schema: [TaskListSchema]})
                .then(realm => {
        let getdata = realm.objects('TaskList');
        this.setState({
            taskdata:getdata
        })
        console.log(this.state.taskdata)
         })
        }

        componentDidMount(){
              this.getTaskData()
        } 

        //Add New record
        add=()=>{  
            this.toggleModal()
            Realm.open({schema: [TaskListSchema]})
        .then(realm => {
            realm.write(() => {
            realm.create('TaskList', {
            id:Math.floor(Date.now()/1000), 
                WorkType:  this.state.work,
                WorkData:this.state.workData,
                Where: this.state.where,
                Time: this.state.date,
                Status: "InActive",
            });
            });
        })
        this.getTaskData()
        }


         //delete particular record
            getListViewItem = (value)=>new Promise((resolve,reject)=>{
                console.log("----")
            Realm.open({schema: [TaskListSchema]}).then(realm =>{
                realm.write(()=>{
                    let deletingTodoList=realm.objectForPrimaryKey("TaskList",value);
                    realm.delete(deletingTodoList);
                    resolve()
                })

            }).catch((error)=>reject(error));
            this.getTaskData()
        });

    //Changing status from active to in active
         updateTodoList =item=>new Promise((resolve,reject)=>{
            Realm.open({schema: [TaskListSchema]}).then(realm =>{
                realm.write(()=>{
                    let updateTodoList=realm.objectForPrimaryKey("TaskList",item.id);
                    updateTodoList.Status="Active";
                    resolve()
                })
            }).catch((error)=>reject(error));
        this.getTaskData()
        });

        renderSeparator = () => {  
                return (  
                    <View  
                        style={{  
                            height: 1,  
                            width: "100%",  
                            backgroundColor: "#000",  
                        }}  
                    />  
                );  
            };  

   
            

            render() {
                return (
                <View style={styles.container}>

                            <Appbar.Header style={{backgroundColor:'#f43f00'}}>
                                    <Appbar.Content title="TODO_List" subtitle="Add Your Work..." />
                                    <Appbar.Action icon="plus-circle-outline" size={30}  onPress={this.toggleModal}/>
                            </Appbar.Header>

                            <FlatList  
                                data={this.state.taskdata}  
                                renderItem={({item}) =>  
                                <TouchableOpacity 
                                onPress={()=>this.updateTodoList(item)}
                                >
                                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                            <Text style={styles.item}>{item.Time}</Text>
                                            <Text style={styles.item}>{item.WorkType}</Text>
                                        </View>
                                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                            <View style={{width:windowWidth/2}}>
                                                <Text style={{fontSize:18,marginLeft:"2%"}}>{item.Where}</Text>
                                                <Text style={{fontSize:16,marginLeft:"2%"}}>{item.WorkData}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',justifyContent:'space-between',alignSelf:'flex-end',marginRight:"2%"}}>
                                                
                                                <Fontisto 
                                                    name={item.Status === "Active" ? "checkbox-active": "checkbox-passive"}
                                                    size={25}
                                                    color={item.Status === "Active" ? "green": "black"}
                                                    style={{marginRight:"10%"}}
                                                    onPress={()=>this.updateTodoList(item)}
                                                    />
                                                    <AntDesign 
                                                    name="delete"
                                                    size={28}
                                                    color="red"
                                                    onPress={()=>this.getListViewItem(item.id)}
                                                    />
                                            </View>
                                        </View>
                                </TouchableOpacity>
                                }  
                                ItemSeparatorComponent={this.renderSeparator}  
                            /> 
            
                    {/* this modal popup is for Add new Record */}
                 <Modal isVisible={this.state.isModalVisible}>
                    <View style={{backgroundColor:'white'}}>
                        <View style={styles.ModalView}>
                            <AntDesign 
                            name="closecircleo"
                            size={20}
                            style={{alignSelf:'flex-end'}}
                            onPress={()=>this.toggleModal()}
                            />
                            <Text style={{textAlign:'center',fontSize:18,fontWeight:'bold',marginBottom:"2%"}}>Today's Task</Text>
                            <Picker selectedValue = {this.state.work} onValueChange = {this.updateWork}>
                                <Picker.Item label = "All Things" value = "All Things" />
                                <Picker.Item label = "Business" value = "Business" />
                                <Picker.Item label = "Personal" value = "Personal" />
                                <Picker.Item label = "Family" value = "Family" />
                                <Picker.Item label = "Work" value = "Work" />
                            </Picker>
                                 <TextInput
                                label="What i have to do?*"
                                value={this.state.workData}
                                onChangeText={workData => this.setState({workData})}
                                style={{marginBottom:"2%"}}
                                />

                                <TextInput
                                label="Where"
                                value={this.state.where}
                                onChangeText={where => this.setState({where})}
                                style={{marginBottom:"2%"}}
                                />

                                <DatePicker
                                    style={{width: windowWidth/1.3,marginBottom:"2%"}}
                                    date={this.state.date}
                                    mode="date"
                                    placeholder="select date"
                                    format="YYYY-MM-DD"
                                    minDate="2020-05-01"
                                    maxDate="2025-06-01"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 36
                                    }
                                    // ... You can check the source to find the other keys.
                                    }}
                                    onDateChange={(date) => {this.setState({date: date})}}
                                />
                            <TouchableOpacity 
                                 style={styles.modalAddBtn}
                                 onPress={()=>this.add()}
                            >
                                    <Text style={styles.modalAddBtnText}>Add Task</Text>
                            </TouchableOpacity>
                    
                         </View>
                    </View>
                 </Modal>
                
                </View>
                );
            }
    }

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
    },  
    item: {  
        padding: 5,  
        fontSize: 18,  
        fontWeight:'bold' 
    }, 
    ModalView:{
        justifyContent:'center',
        width:windowWidth/1.3,
        marginLeft:'auto',
        marginRight:'auto',
        marginTop:'10%'
    },
    modalAddBtn:{
        backgroundColor:'#f43f00',
        width:'30%',
        borderRadius:20,
        paddingLeft:"2%",
        paddingRight:"2%",
        marginLeft:'auto',
        marginRight:'auto',
        marginBottom:'10%'
    } ,
    modalAddBtnText:{
        textAlign:'center',
        color:'white',
        fontSize:18
    }
})  