import mutations from "../../graphql/mutations"
import checkOptions from "../../utils/checkOptions"

export default function (options) {
  checkOptions(options, [
    {
      name: 'roleIdList',
      type: Array
    },
    {
      name: 'groupId',
      type: String
    }
  ])
  return this.fetchToken.then(() => {
    return this.UserServiceGql.request({
      operationName: "AddRoleToRBACGroupBatch",
      query: mutations.addRoleToRBACGroupBatch,
      variables: {
        input: options
      }
    })
  })
}
