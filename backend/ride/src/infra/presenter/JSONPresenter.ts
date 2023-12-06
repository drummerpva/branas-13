import { Presenter } from '../../application/presenter/Presenter'

export class JSONPresenter implements Presenter {
  present(data: any) {
    return data
  }
}
