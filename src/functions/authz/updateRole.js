import mutations from "../../graphql/mutations"
import checkOptions from "../../utils/checkOptions"

const createGroup = function (options) {
  checkOptions(options, [
    {
      name: '_id',
      type: String
    },
    {
      name: 'name',
      type: String
    },
    {
      name: 'description',
      type: String
    }
  ])
  return this.fetchToken.then(() => {
    return this.UserServiceGql.request({
      operationName: "UpdateRBACRole",
      query: mutations.updateRBACRole,
      variables: {
        input: options
      }
    })
  })
}

export default createGroup