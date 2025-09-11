from algopy import ARC4Contract, arc4, Txn
import algopy  # Import Txn directly

# Define a custom ARC‑4 struct for medicine information.
class MedicineInfo(arc4.Struct, kw_only=True, frozen=False):
    name: arc4.String       # Medicine name.
    expiry: arc4.UInt64     # Expiry round.
    quantity: arc4.UInt64   # Available quantity.
    lender: arc4.Address    # The lender's address.

# Define a struct for a medicine request.
class MedicineRequest(arc4.Struct, kw_only=True, frozen=True):
    medicine_name: arc4.String  # Name of the requested medicine.
    requester: arc4.Address     # Requester's address.

# Define a struct for a medicine record (fulfillment record).
class MedicineRecord(arc4.Struct, kw_only=True, frozen=True):
    medicine_name: arc4.String  # Medicine name.
    requester: arc4.Address     # Requester's address.
    timestamp: arc4.UInt64      # Round at which the request was fulfilled.

# class MedicineLendingPlatform(ARC4Contract):
#     # Global state arrays maintained as ARC‑4 DynamicArrays.
#     medicines: arc4.DynamicArray[MedicineInfo] = arc4.DynamicArray()
#     medicine_requests: arc4.DynamicArray[MedicineRequest] = arc4.DynamicArray()
#     medicine_records: arc4.DynamicArray[MedicineRecord] = arc4.DynamicArray()
class MedicineLendingPlatform(ARC4Contract):
    medicines: arc4.DynamicArray[MedicineInfo]  # Type declaration only
    medicine_requests: arc4.DynamicArray[MedicineRequest]
    medicine_records: arc4.DynamicArray[MedicineRecord]
    
    def __init__(self) -> None:
        self.medicines = arc4.DynamicArray[MedicineInfo]()
        self.medicine_requests = arc4.DynamicArray[MedicineRequest]()
        self.medicine_records = arc4.DynamicArray[MedicineRecord]()


        
    @arc4.abimethod()
    def register_medicine(self,
                          name: arc4.String,
                          expiry: arc4.UInt64,
                          quantity: arc4.UInt64) -> arc4.Bool:
        """
        Registers or updates a medicine.
        If the medicine already exists, increases its quantity.
        Sets the lender to the transaction sender.
        """
        for i in algopy.urange(self.medicines.length):
            m = self.medicines[i].copy()
            if m.name == name:
                new_qty = m.quantity.native + quantity.native
                m.quantity = arc4.UInt64(new_qty)
                return arc4.Bool(True)
        new_med = MedicineInfo(
        name=name,
        expiry=expiry,
        quantity=quantity,
        lender=arc4.Address(Txn.sender)  # Convert Account to Address
    )
        self.medicines.append(new_med.copy())
        
        return arc4.Bool(True)

    @arc4.abimethod()
    def request_medicine(self, name: arc4.String) -> arc4.Bool:
        """
        Records a request for a medicine if available and not expired.
        """
        for i in algopy.urange(self.medicines.length):
            m = self.medicines[i].copy()
            if m.name == name:
                if m.quantity > arc4.UInt64(0) and Txn.first_valid_time <= m.expiry:  # Note: no parentheses
                    req = MedicineRequest(
                        medicine_name=name,
                        requester=arc4.Address(Txn.sender)  # Convert Account to Address
                    )
                    self.medicine_requests.append(req)
                    return arc4.Bool(True)
                else:
                    return arc4.Bool(False)
        return arc4.Bool(False)

    @arc4.abimethod()
    def approve_request(self, name: arc4.String) -> arc4.Bool:
        """
        Approves a medicine request.
        Only the lender (registrant) may approve.
        On approval, decreases quantity and records the medicine record.
        """
        for i in algopy.urange(self.medicines.length):
            m = self.medicines[i].copy()
            if m.name == name:
                if Txn.sender != m.lender:  # Use the global Txn object
                    return arc4.Bool(False)
                for req in self.medicine_requests:
                    if req.medicine_name == name:
                        if m.quantity > arc4.UInt64(0):
                            new_qty = m.quantity.native - 1
                            m.quantity = arc4.UInt64(new_qty)
                            record = MedicineRecord(
                                medicine_name=name,
                                requester=req.requester,
                                timestamp=arc4.UInt64(Txn.first_valid_time)  # Ensure correct UInt64 type
                            )
                            self.medicine_records.append(record)
                            # Optionally: remove the fulfilled request from the array.
                            return arc4.Bool(True)
                return arc4.Bool(False)
        return arc4.Bool(False)

    @arc4.abimethod()
    def return_medicine(self, name: arc4.String) -> arc4.Bool:
        """
        Processes the return of a medicine by increasing its quantity.
        """
        for i in algopy.urange(self.medicines.length):
            m = self.medicines[i].copy()
            if m.name == name:
                new_qty = m.quantity.native + 1
                m.quantity = arc4.UInt64(new_qty)
                return arc4.Bool(True)
        return arc4.Bool(False)

    @arc4.abimethod()
    def is_expired(self, name: arc4.String) -> arc4.Bool:
        """
        Checks if a medicine is expired (i.e. current round > expiry).
        """
        for i in algopy.urange(self.medicines.length):
            m = self.medicines[i].copy()
            if m.name == name:
                return arc4.Bool(Txn.first_valid_time > m.expiry)  # Use the global Txn object
        return arc4.Bool(True)
