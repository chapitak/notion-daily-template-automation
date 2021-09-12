import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID

function getToday(){
  var date = new Date();
  var year = date.getFullYear().toString().substring(2,4);
  var month = ("0" + (1 + date.getMonth())).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);

  return year + month + day;
}

function getTodayHyphen(){
  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (1 + date.getMonth())).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);

  return year + "-" + month + "-" + day;
}

function isId(element)  {
  if(element.name === 'object')  {
    return true;
  }
}

async function RetrievePage(todayPageId) {
  const pageId = todayPageId;
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response.properties;
}

async function RetrieveBlockChildren(todayPageId) {
  const blockId = todayPageId;
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });
  return response;
};

async function CreateYesterdayPage(properties, children) {
  // let pageInfo = {
  //   parent: { 
  //             database_id: "5957f209-e5dd-49ce-9ab0-05b06fab509b"}
  // };

  let pageInfo = {
    "parent": {
        "database_id": "5957f209-e5dd-49ce-9ab0-05b06fab509b"
    },
}
  pageInfo.properties = properties;
  pageInfo.properties.Date.date.start = getTodayHyphen();
  pageInfo.properties.Name.title[0].text.content = getToday();
  pageInfo.children = children;
  console.log(pageInfo);
  const response = await notion.pages.create(pageInfo);
  console.log(response);
}

// function DeleteAllBlocks(allBlocks) {
//   const blockId = todayPageId;
//   const response = await notion.blocks.children.list({
//     block_id: blockId,
//     page_size: 50,
//   });
//   console.log(response);
// }

// addItem("Yurts in Big Sur, California")
//console.log(RetrievePage("67e0a611-92f1-4588-88ec-e7e6bb614775"));
//RetrievePage("67e0a611-92f1-4588-88ec-e7e6bb614775").then((value) => console.log(value))
const children = RetrieveBlockChildren("67e0a611-92f1-4588-88ec-e7e6bb614775")//.then((value) => console.log(value))
const properties = RetrievePage("67e0a611-92f1-4588-88ec-e7e6bb614775")//.then((value) => console.log(value))

// RetrieveBlockChildren("67e0a611-92f1-4588-88ec-e7e6bb614775");

// Promise.all([properties, children]).then(function (values) {
//   CreateYesterdayPage(values[0], values[1].results);
// })

children.then((value) => console.log(value.results.filter(({element}) => element.name === 'id')))