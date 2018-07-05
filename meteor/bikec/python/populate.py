from pymongo import MongoClient

def myFloat(v):
        try:
            res = float(v)
        except ValueError:
            res = None
        return res

def myInt(v):
        try:
            res = int(v)
        except ValueError:
            res = None
        return res

translate = dict()
translate['marque'] = 'brand'
translate['modele'] = 'model'
translate['taille'] = 'size'
translate['annee'] = 'year'
translate['hcv'] = 'virtual_seat_tube'
translate['lcv'] = 'virtual_top_tube'
translate['hc'] = 'seat_tube'
translate['lc'] = 'top_tube'
translate['atdf'] = 'head_tube_angle'
translate['atds'] = 'seat_tube_angle'
translate['hdd'] = 'head_tube_length'
translate['base_ar'] = 'chain_stay_length'
translate['base_av'] = 'front_center'
translate['empattement'] = 'wheelbase'
translate['dp'] = 'bottom_bracket_drop'
translate['hp'] = 'bracket_height'
translate['stack'] = 'stack'
translate['reach'] = 'reach'
translate['lm'] = 'crank_length'
translate['deport'] = 'fork_rate'
translate['htv'] = 'virtual_heel_height'


def from_csv(filename):
        f = open(filename, 'r')
        for ligne in f:
            ls = ligne.split(',')
            #print(ls)
            marque, modele, taille, annee, hcv, lcv, hc, lc, atdf, atds, hdd, base_ar, base_av, empattement, dp, hp, stack, reach, lm, deport = ls
            marque = marque.strip()
            modele = modele.strip()
            taille = taille.strip()
            annee = myInt(annee)
            hcv = myFloat(hcv)
            lcv = myFloat(lcv)
            hc = myFloat(hc)
            lc = myFloat(lc)
            atdf = myFloat(atdf)
            atds = myFloat(atds)
            hdd = myFloat(hdd)
            base_ar = myFloat(base_ar)
            base_av = myFloat(base_av)
            empattement = myFloat(empattement)
            dp = myFloat(dp)
            hp = myFloat(hp)
            stack = myFloat(stack)
            reach = myFloat(reach)
            lm = myFloat(lm)
            deport = myFloat(deport)

            entry = {
                    translate['marque'] : str(marque),
                    translate['modele'] : str(modele),
                    translate['taille'] : str(taille),
                    translate['annee']  : str(annee),
                    translate['hcv']    : str(hcv),
                    translate['lcv']    : str(lcv),
                    translate['hc']     : str(hc),
                    translate['lc']     : str(lc),
                    translate['atdf']   : str(atdf),
                    translate['atds']   : str(atds),
                    translate['hdd']    : str(hdd),
                    translate['base_ar'] : str(base_ar),
                    translate['base_av'] : str(base_av),
                    translate['empattement'] : str(empattement),
                    translate['dp']     : str(dp),
                    translate['hp']     : str(hp),
                    translate['stack']  : str(stack),
                    translate['reach']  : str(reach),
                    translate['lm']     : str(lm),
                    translate['deport'] : str(deport),
                    }

            #print(entry)
            #db.insert(entry)




client = MongoClient('mongodb://127.0.0.1:3001/meteor')
db = client.meteor.frames
from_csv('base6.csv')

#res = db.find_one({'brand': 'Time'})
#print(res)

res = db.find({})
for e in res:
    print(e)



