# import logging

# import algokit_utils

# logger = logging.getLogger(__name__)


# # define deployment behaviour based on supplied app spec
# def deploy() -> None:
#     from smart_contracts.artifacts.lend_borrow.medicine_lending_platform_client import (
#         MedicineLendingPlatformClient,
#         HelloArgs,
#         LendBorrowFactory,
#         RegisterMedicineArgs,
#         RequestMedicineArgs,
#         ApproveRequestArgs,
#         ReturnMedicineArgs,
#         IsExpiredArgs,
#         MedicineLendingPlatformFactory,
#     )

#     algorand = algokit_utils.AlgorandClient.from_environment()
#     deployer_ = algorand.account.from_environment("DEPLOYER")

#     factory = algorand.client.get_typed_app_factory(
#         LendBorrowFactory, default_sender=deployer_.address
#     )

#     app_client, result = factory.deploy(
#         on_update=algokit_utils.OnUpdate.AppendApp,
#         on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
#     )

#     if result.operation_performed in [
#         algokit_utils.OperationPerformed.Create,
#         algokit_utils.OperationPerformed.Replace,
#     ]:
#         algorand.send.payment(
#             algokit_utils.PaymentParams(
#                 amount=algokit_utils.AlgoAmount(algo=1),
#                 sender=deployer_.address,
#                 receiver=app_client.app_address,
#             )
#         )

#     name = "world"
#     response = app_client.send.hello(args=HelloArgs(name=name))
#     logger.info(
#         f"Called hello on {app_client.app_name} ({app_client.app_id}) "
#         f"with name={name}, received: {response.abi_return}"
#     )








import logging
import algokit_utils

logger = logging.getLogger(__name__)

# define deployment behaviour based on supplied app spec
def deploy() -> None:
    from smart_contracts.artifacts.lend_borrow.medicine_lending_platform_client import (
        RegisterMedicineArgs,
        RequestMedicineArgs,
        ApproveRequestArgs,
        ReturnMedicineArgs,
        IsExpiredArgs,
        MedicineLendingPlatformFactory,
    )

    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer_ = algorand.account.from_environment("DEPLOYER")

    factory = algorand.client.get_typed_app_factory(
        MedicineLendingPlatformFactory, default_sender=deployer_.address
    )

    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )

    if result.operation_performed in [
        algokit_utils.OperationPerformed.Create,
        algokit_utils.OperationPerformed.Replace,
    ]:
        algorand.send.payment(
            algokit_utils.PaymentParams(
                amount=algokit_utils.AlgoAmount(algo=1),
                sender=deployer_.address,
                receiver=app_client.app_address,
            )
        )

    # Register first medicine: Paracetamol
    medicine_name = "Paracetamol"
    expiry = 30122030  # Example expiry round
    quantity = 100  # Example quantity
    
    response = app_client.send.register_medicine(
        args=RegisterMedicineArgs(
            name=medicine_name,
            expiry=expiry,
            quantity=quantity
        )
    )
    
    logger.info(
        f"Called register_medicine on {app_client.app_name} ({app_client.app_id}) "
        f"with name={medicine_name}, expiry={expiry}, quantity={quantity}, received: {response.abi_return}"
    )
    
    # Register second medicine: Carmustine
   
