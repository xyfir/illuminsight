import { Insightful } from 'types/insightful';

export const testTags: Insightful.Tag[] = [
  { id: 1556915133433, name: 'alpha' },
  { id: 1556915133434, name: 'bravo' },
  { id: 1556915133435, name: 'charlie' },
  { id: 1556915133436, name: 'delta' }
];

export const testPub: Insightful.Pub = {
  authors: 'Jane Austen',
  bookmark: { section: 0, element: 0 },
  id: 1556915133437,
  name: 'Pride and Prejudice',
  cover: 'images/cover.jpg',
  published: -4952074022000,
  toc: [
    { section: 0, element: 0, title: 'Title' },
    { section: 1, element: 0, title: 'Pride and Prejudice' },
    { section: 2, element: 0, title: 'Index' }
  ],
  sections: 3,
  starred: false,
  tags: [],
  version: process.enve.ASTPUB_VERSION,
  words: '123'
};

export const testAST: Insightful.AST[] = [
  {
    n: 'h1',
    c: ['Heading 1']
  },
  {
    n: 'p',
    c: [
      'This is a paragraph',
      {
        n: 'a',
        c: ['with a link'],
        a: { href: 'https://example.com' }
      },
      'and',
      {
        n: 'em',
        c: [
          {
            n: 'strong',
            c: ['strongly']
          },
          'emphasised text'
        ]
      },
      'and',
      {
        n: 'code',
        c: ['inline code']
      }
    ]
  },
  {
    n: 'h2',
    c: ['Heading 2']
  },
  { n: 'hr' },
  {
    n: 'img',
    a: {
      src: 'images/0.png',
      alt: 'A picture of ...'
    }
  },
  {
    n: 'ul',
    c: [
      {
        n: 'li',
        c: ['UL item #1']
      },
      {
        n: 'li',
        c: ['UL item #2']
      }
    ]
  },
  {
    n: 'ol',
    c: [
      {
        n: 'li',
        c: ['OL item #1']
      },
      {
        n: 'li',
        c: ['OL item #2']
      }
    ]
  },
  {
    n: 'pre',
    c: [
      {
        n: 'code',
        c: ['code block line 1\ncode block line 2']
      }
    ]
  }
];

export const alternateTestAST: Insightful.AST[] = [
  { n: 'h1', c: ['Lorem Ipsum ...'] },
  {
    n: 'p',
    c: [
      '... dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus quam id leo in vitae. Gravida quis blandit turpis cursus in hac. Molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit sed. Sed cras ornare arcu dui. Nisi porta lorem mollis aliquam ut porttitor leo a. Sit amet cursus sit amet dictum sit amet. Faucibus in ornare quam viverra orci sagittis. Quis vel eros donec ac odio tempor. Elementum curabitur vitae nunc sed velit dignissim sodales ut. Lacus laoreet non curabitur gravida arcu ac. Tempor orci eu lobortis elementum nibh tellus. Nisi est sit amet facilisis. Tristique risus nec feugiat in fermentum posuere urna.'
    ]
  },
  {
    n: 'p',
    c: [
      'Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae. Sit amet luctus venenatis lectus magna fringilla. Consectetur adipiscing elit duis tristique sollicitudin. Metus aliquam eleifend mi in nulla posuere. Orci eu lobortis elementum nibh tellus molestie nunc. Consequat semper viverra nam libero justo laoreet sit. Consequat mauris nunc congue nisi. Sem integer vitae justo eget. Habitant morbi tristique senectus et netus. Id neque aliquam vestibulum morbi blandit. Porta non pulvinar neque laoreet suspendisse interdum consectetur libero id. Sit amet facilisis magna etiam tempor orci eu lobortis elementum. Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque. Vel facilisis volutpat est velit.'
    ]
  },
  {
    n: 'p',
    c: [
      'Turpis massa tincidunt dui ut ornare lectus sit amet. Ultricies mi eget mauris pharetra et. Velit egestas dui id ornare arcu odio ut. Posuere lorem ipsum dolor sit amet consectetur. Risus quis varius quam quisque id. Ultrices gravida dictum fusce ut placerat orci nulla pellentesque. Viverra vitae congue eu consequat ac felis donec et odio. Nunc eget lorem dolor sed viverra. At lectus urna duis convallis convallis. Pharetra pharetra massa massa ultricies mi. Sem nulla pharetra diam sit amet nisl suscipit adipiscing. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae. Lectus quam id leo in vitae turpis massa sed. Viverra tellus in hac habitasse platea dictumst. Netus et malesuada fames ac turpis egestas.'
    ]
  },
  {
    n: 'p',
    c: [
      'Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Dignissim suspendisse in est ante in nibh. Facilisis mauris sit amet massa vitae tortor condimentum. Sit amet nulla facilisi morbi tempus. In vitae turpis massa sed elementum tempus egestas sed. Vel quam elementum pulvinar etiam non quam lacus. Massa massa ultricies mi quis hendrerit dolor magna. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Viverra justo nec ultrices dui sapien. Pellentesque elit eget gravida cum sociis natoque penatibus. Diam volutpat commodo sed egestas egestas fringilla phasellus. Nascetur ridiculus mus mauris vitae ultricies leo integer malesuada.'
    ]
  },
  {
    n: 'p',
    c: [
      'Erat imperdiet sed euismod nisi porta lorem mollis aliquam ut. Gravida cum sociis natoque penatibus et. Sit amet est placerat in egestas erat imperdiet. Eu feugiat pretium nibh ipsum consequat nisl vel pretium. Massa id neque aliquam vestibulum morbi blandit cursus risus at. Praesent elementum facilisis leo vel fringilla est ullamcorper eget nulla. At ultrices mi tempus imperdiet nulla malesuada pellentesque. Nunc vel risus commodo viverra maecenas. Mattis nunc sed blandit libero volutpat sed cras ornare arcu. Sed egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium.'
    ]
  }
];

export const testWikitext = `{{other uses}}
{{more citations needed|date=April 2018}}
{{Infobox book| <!-- See Wikipedia:WikiProject_Novels or Wikipedia:WikiProject_Books -->
| name          = Blood Meridian or the Evening Redness in the West
| title_orig    =
| translator    =
| image         = CormacMcCarthy BloodMeridian.jpg
| caption       = First edition cover
| author        = [[Cormac McCarthy]]
| cover_artist  =
| country       = United States
| language      = English
| series        =
| genre         = [[Western (genre)|Western]], [[historical novel]]
| publisher     = [[Random House]]
| release_date  = April 1985
| media_type    = Print ([[Hardcover|hardback]] and [[paperback]])
| pages         = 337 pp (first edition, hardback)
| isbn          = 0-394-54482-X
| isbn_note     = (first edition, hardback)
| dewey         = 813/.54 19
| congress      = PS3563.C337 B4 1985
| oclc          = 234287599
}}

'''''Blood Meridian or The Evening Redness in the West''''' is a [[1985 in literature|1985]] [[Epic (genre)|epic]] [[Western (genre)|Western]] (or [[Revisionist Western|anti-Western]])<ref>{{cite journal |last=Kollin |first=Susan |title=Genre and the Geographies of Violence: Cormac McCarthy and the Contemporary Western |journal=Contemporary Literature |volume=42 |issue=3 |publisher=University of Wisconsin Press |year=2001 |pages=557–88 |jstor=1208996 }}</ref><ref>Hage, Erik. ''Cormac McCarthy: A Literary Companion. North Carolina: 2010. p. 45</ref> novel by American author [[Cormac McCarthy]]. McCarthy's fifth book, it was published by [[Random House]].

The majority of the story follows a teenager referred to only as "the kid," with the bulk of the text devoted to his experiences with the [[John Joel Glanton|Glanton gang]], a historical group of [[scalping|scalp hunters]] who massacred [[Indigenous peoples of the Americas|Native Americans]] and others in the [[United States–Mexico border]]lands from 1849 to 1850 for bounty, pleasure, and eventually out of nihilistic habit. The role of [[antagonist]] is gradually filled by [[Judge Holden]], a physically massive, highly-educated, exceptionally multi-talented member of the gang, depicted as completely bald from head to toe.

Although the novel initially generated only lukewarm critical and commercial reception, it has since become highly acclaimed and is widely recognized as McCarthy's masterpiece, as well as one of the greatest American novels of all time.<ref>{{Cite web|url=http://www.avclub.com/articles/harold-bloom-on-blood-meridian,29214/ |title= Harold Bloom on Blood Meridian }}</ref>

==Plot==
The novel follows an adolescent runaway from Tennessee with a predilection for violence, known only as "the kid," who is introduced as being born during the famous [[Leonids]] [[meteor shower]] of 1833. In the late 1840s, he first encounters an enormous and completely hairless character, named Judge Holden, at a [[Revival meeting|religious revival]] in [[Nacogdoches, Texas]]. There, Holden shows his dark nature by falsely accusing a preacher of raping both a young girl and a goat, inciting those attending the revival to physically attack the preacher.

The kid journeys on alone on his mule through the plains of [[eastern Texas]], and he spends a night in the shelter of a recluse before arriving in "Bexar". After a violent encounter with a bartender, which establishes the kid as a formidable fighter, he joins a party of ill-armed [[United States Army]] [[Irregular military|irregulars]], led by a Captain White, on a [[Filibuster (military)|filibustering mission]] to claim Mexican land for the United States. Shortly after entering [[Mexico]], they are attacked, and many killed, by a band of [[Comanche]] warriors. Arrested in [[Chihuahua (state)|Chihuahua]], the kid is set free when his cell neighbor and prior acquaintance from Texas: the earless Louis Toadvine, tells the authorities that the two of them would make useful recruits for the state's newly-hired scalp hunting operation led by John Joel Glanton.

Toadvine and the kid consequently join Glanton's gang. The bulk of the novel details the gang's conversations and depraved, murderous activities as they travel on horseback throughout the borderlands. The gang encounters a [[traveling carnival]]. The gang originally contracts with various regional leaders to exterminate [[Apache]]s and is given a [[bounty (reward)|bounty]] for each scalp they recover. Before long, however, they murder almost anything in their path, including peaceful agrarian Indians, unprotected Mexican villagers, and even Mexican and American soldiers.

Judge Holden, who re-enters the story as a fellow scalp hunter in the Glanton gang, is presented as a profoundly mysterious and awe-inspiring figure; the others seem to regard him as not quite human. Despite his refined manner and remarkable intellect, the judge often proves to be among the most ruthless and bloodthirsty members of the gang and is strongly implied to prey on children during their travels. According to an ex-priest gang member named Tobin, the Glanton gang first met the judge while fleeing from the onslaught of a much larger group of Apaches. In the middle of the desert, the gang found Holden sitting on an enormous boulder, where he seemed to be waiting for them all. He took them to an extinct volcano, and improvised gunpowder from natural materials, enough to give them the advantage against their Apache pursuers. When the kid remembers seeing Holden in Nacogdoches, Tobin explains that each man in the gang claims to have met the judge at some point before joining Glanton's gang.

After months of marauding, the gang crosses into the [[Mexican Cession]], where they set up a systematic and brutal robbery operation at a ferry on the [[Colorado River]] near [[Yuma, Arizona]]. Local [[Quechan|Yuma]] (Quechan) Indians are approached to help the gang gain control of the ferry from its original owner, but Glanton's gang betrays the natives, using their presence and previously coordinated attack on the ferry as an excuse to seize the ferry's munitions and slaughter the Yuma. Because of the new operators' brutal ways, a group of US Army soldiers sets up a second ferry at a [[ford (crossing)|ford]] upriver to cross—which the Yuma briefly appropriate until their ferryman is decapitated and thrown in the river. Eventually, after the gang had amassed a large fortune through robbing settlers using the ferry, the Yumas suddenly attack the gang and kill most of them including Glanton, though Holden (after fighting off the Yumas using his immense strength to level a [[howitzer]] by hand) survives and escapes.

The kid, Toadvine, and Tobin are among the few other survivors who escape into the desert, although the kid takes an arrow in the leg. Heading west together, the kid and Tobin encounter a weaponless and hatless Judge Holden and his accompanying imbecile arriving at a watering-hole. The judge negotiates successfully for Toadvine's hat and unsuccessfully for the kid's pistol, and invites them to share in the 'common'  water. The kid and Tobin leave the watering hole and move on through the desert. The next evening at another watering site, they have a surprise-attack shoot-out with the judge, who fires a non-fatal shot to Tobin's neck. The kid shoots the two horses the judge came with. As Tobin and the kid hide among bones near the desert creek, the judge delivers a speech about property rights (regarding the shot horses) and advises the kid to reveal himself. Ignoring this, Tobin and the kid continue their travels, both wounded and much weakened. The judge follows the trail and them from a few miles behind. The next day the duo move off the trail and hide, hoping to let the judge pass them by. The judge does repeatedly pass by them, quite near and initially unaware; and soon addresses them aloud, knowing they are hiding nearby.  Although the kid has had three easy clear-shot opportunities to shoot the judge as Tobin strongly advises, he doesn't take the shots. The judge and the imbecile then leave. Tobin and the kid are in quite bad shape and would likely have died out in the desert, but some benevolent Indians rescue them and they survive.

Both parties end up in [[San Diego, California|San Diego]], but the kid gets separated from Tobin when he is caught by local authorities and imprisoned. Holden visits him in jail, stating that he told the jailers "the truth": that the kid alone was responsible for the end of the Glanton gang. The kid declares that the judge was responsible for the gang's evils, but the judge denies it. After reaching through the cell bars to try to touch the kid, Holden leaves the kid alone, stating that he "has errands." The kid is released and seeks a doctor to treat his wound. Under the influence of medicinal [[Diethyl Ether|ether]], he hallucinates that the judge is visiting him, along with a curious man who forges coins. The kid recovers and seeks out Tobin, with no luck. He makes his way to [[Los Angeles]], where he witnesses the executions of Toadvine and David Brown—leaving Tobin, whose fate is uncertain, the judge, and the kid as the remaining alive gang members.

Following this, the kid again wanders across the American West. In 1878, he makes his way to [[Fort Griffin]], Texas and is now referred to by the author as "the man." The lawless city is a center for processing the remains of the [[American bison]], which have been hunted nearly to extinction. At a [[Western saloon|saloon]], where a traveling roadshow performs with a trained dancing bear, the man yet again meets the judge, who does not seem to have aged in the intervening years. Holden calls the man "the last of the true." and the pair talk on equal terms. Holden describes the man as a disappointment, stating that the man held in his heart "clemency for the heathen." Holden declares prophetically that the man has arrived at the saloon for "the dance." A drunk man shoots the dancing bear, and the man tells the judge, "You ain't nothin'," and, noting the dead bear, says that "even a dumb animal can dance."

The man hires a prostitute, then afterward goes to an [[outhouse]] under another meteor shower. In the outhouse, he is surprised by the naked judge there waiting for him, who "gather[s] him in his arms against his immense and terrible flesh." This is the last mention of the man. As two men from the saloon approach the outhouse, another man admonishes them not to open the door. They do so anyway, and gaze in awed horror at what they see, stating only, "Good God almighty." The last paragraph finds the judge back in the saloon, dancing in the nude and playing fiddle wildly among the drunkards and prostitutes, claiming that he never sleeps, and will never die.

A brief [[epilogue]] features an unspecified person augering a row of holes across the prairie. The worker sparks a fire in each of the holes while an assortment of passionless wanderers crosses the row. The line of holes is described as "a validation of sequence and causality as if each round and perfect hole owed its existence to the one before it there on that prairie."

==Characters==
===Major characters===
* The kid: The novel's anti-heroic protagonist, the kid is a Tennessean initially in his mid-teens whose mother died in [[childbirth]] and who flees from his father to Texas. He is said to have a disposition for bloodshed and is involved in many vicious actions early on; he takes up inherently violent professions, specifically being recruited by murderers including Captain White, and later, by Glanton and his gang, to secure release from a prison in [[Chihuahua (state)|Chihuahua, Mexico]]. The kid takes part in many of the Glanton gang's scalp-hunting rampages, but gradually displays a moral fiber that ultimately puts him at odds with the Judge. "The kid" is later, as an adult, referred to as "the man," when he encounters the judge again after nearly three decades.
* [[Judge Holden]], '''or "the judge"''': An enormous, pale, and hairless man, who often seems almost mythical or supernatural. Possessing peerless knowledge and talent in everything from dance to legal argument, Holden is a dedicated examiner and recorder of the natural world and a supremely violent and perverted character. He rides with (though largely does not interact with) Glanton's gang after they find him sitting on a rock in the middle of the desert and he saves them from an Apache attack using his exceptional intellect, skill, and nearly superhuman strength. It is hinted at that he and Glanton have forged some manner of a pact, possibly for the very lives of the gang members.  He gradually becomes the antagonist to the kid after the dissolution of Glanton's gang, occasionally having brief reunions with the kid to mock, debate, or terrorize him. Unlike the rest of the gang, Holden is socially refined and remarkably well-educated; however, he perceives the world as ultimately violent, [[fatalism|fatalistic]], and liable to an endless cycle of bloody conquest, with [[human nature]] and autonomy defined by the will to violence; he asserts, ultimately, that "War is god."
* '''Louis Toadvine''': A seasoned outlaw the kid originally encounters in a vicious brawl and who then burns down a hotel, Toadvine is distinguished by his head which has no ears and his forehead branded with the letters H, T, (standing for "horse thief") and F. He later reappears unexpectedly as a cellmate of the kid in the Chihuahua prison. Here, he somewhat befriends the kid, negotiating his and the kid's release in return for joining Glanton's gang, to whom he claims dishonestly that he and the kid are experienced scalp hunters. Toadvine is not as depraved as the rest of the gang and opposes the judge's methods ineffectually, but is still a violent individual himself. He is hanged in Los Angeles alongside David Brown.

===Other recurring characters===
* '''Captain White, or "the captain"''': An ex-professional soldier and [[American exceptionalism|American supremacist]] who believes that Mexico is a lawless nation destined to be conquered by the United States, Captain White leads a ragtag group of militants into Mexico. The kid joins Captain White's escapades before his capture and imprisonment; he later discovers that White has been decapitated by his enemies.
* [[John Joel Glanton]], or simply '''Glanton''': Glanton is the American leader (sometimes deemed "captain") of a band of [[Scalping|scalphunters]] who murder Indians as well as Mexican civilians and militants alike. His history and appearance are not clarified, except that he is physically small with black hair and has a wife and child in Texas though he has been banned from returning there because of his criminal record. A clever strategist, his last major action is to seize control of a profitable Colorado River ferry, which leads him and most of his gang to be killed in an ambush by Yuma Indians.
* '''Tobin, or "the ex-priest"''': A former [[novice]] of the [[Society of Jesus]], Tobin instead turns to a life of crime in Glanton's gang, though remains deeply religious. He feels an apparently friend-like bond with the kid and abhors the judge and his philosophy; he and the judge gradually become great spiritual enemies. Although he survives the Yuma massacre of Glanton's gang, during his escape in the desert he is shot in the neck by the judge and seeks medical attention in San Diego. His ultimate fate, however, remains unknown.
* '''David Brown''': An especially radical member of the Glanton band, David Brown becomes known for his dramatic displays of violence.  He wears a necklace of human ears (similar to the one worn by Bathcat before his immolation). He is arrested in San Diego and sought out by Glanton personally, who seems especially concerned to see him freed (though Brown ends up securing his own release). Though he survives the Yuma massacre, he is captured with Toadvine in Los Angeles and both are hanged.
* '''John Jackson''': "John Jackson" is a name shared by two men in Glanton's gang— one black, one white— who detest one another and whose tensions frequently rise  when in each other's presence. After trying to drive the black Jackson away from a campfire with a racist remark, the white one is decapitated by the black one; the black Jackson later becomes the first person murdered in the Yuma massacre.

==Themes==
{{refimprove section|date=April 2018}}

===Violence===
A major theme is the warlike nature of man. A show of violence early in the novel consists of the protagonist getting clubbed in the head.<ref>p. 9</ref> Critic [[Harold Bloom]]<ref>Bloom, Harold, ''How to Read and Why''. New York: 2001.</ref> praised ''Blood Meridian'' as one of the best 20th century American novels, describing it as "worthy of [[Herman Melville]]'s ''[[Moby-Dick]]'',"<ref>Bloom, Harold, [http://www.boston.com/news/globe/editorial_opinion/oped/articles/2003/09/24/dumbing_down_american_readers/ "Dumbing down American readers."] ''Boston Globe'', op-ed, September 24, 2003.</ref>  but admitted that he found the book's pervasive violence so shocking that he had several false starts before reading the book entirely. Caryn James argued that the novel's violence was a "slap in the face" to modern readers cut off from the brutality of life, while Terrence Morgan thought that, though initially shocking, the effect of the violence gradually waned until the reader was bored.<ref>Owens, p. 7.</ref> Billy J. Stratton contends that the brutality depicted is the primary mechanism through which McCarthy challenges binaries and promotes his revisionist agenda.<ref>{{cite journal |last=Stratton |first=Billy J. |title=‘el brujo es un coyote’: Taxonomies of Trauma in Cormac McCarthy's Blood Meridian |journal=Arizona Quarterly: A Journal of American Literature, Culture, and Theory |volume=67 |issue=3 |year=2011 |pages=151–172 |doi=10.1353/arq.2011.0020 }}</ref> Lilley argues that many critics struggle with the fact that McCarthy does not use violence for "jury-rigged, symbolic plot resolutions . . . In McCarthy's work, violence tends to be just that; it is not a sign or symbol of something else."<ref name="Lilley, p. 19">Lilley, p. 19.</ref>

===Epigraphs and ending===
Three [[Epigraph (literature)|epigraphs]] open the book: quotations from French writer [[Paul Valéry]], from German [[Christian mystic]] [[Jacob Boehme]], and a 1982 news clipping from the ''[[Yuma Sun]]'' reporting the claim of members of an [[Ethiopia]]n archeological excavation that a fossilized skull three hundred millennia old seemed to have been scalped.
The themes implied by the epigraphs have been variously discussed without specific conclusions.{{citation needed|date=April 2018}}

As noted above concerning the ending, the most common interpretation of the novel is that Holden kills the kid in a Fort Griffin, Texas, outhouse. The fact that the kid's death is not depicted might be significant. ''Blood Meridian'' is a catalog of brutality, depicting, in sometimes explicit detail, all manner of violence, bloodshed, brutality and cruelty. For the dramatic climax to be left undepicted leaves something of a vacuum for the reader: knowing full well the horrors established in the past hundreds of pages, the kid's unstated fate might still be too awful to describe, and too much for the mind to fathom: the sight of the kid's fate leaves several witnesses stunned almost to silence; never in the book does any other character have this response to violence, again underlining the singularity of the kid's fate.

Patrick W. Shaw argues that Holden has sexually violated the protagonist. As Shaw writes, the novel had several times earlier established "a sequence of events that gives us ample information to visualize how Holden molests a child, then silences him with aggression."<ref>Shaw, p. 109.</ref> According to Shaw's argument, Holden's actions in the Fort Griffin outhouse are the culmination of what he desired decades earlier: to rape the kid, then perhaps kill him to silence the only survivor of the Glanton gang. If the judge wanted only to kill the kid, there would be no need for him to undress as he waited in the outhouse. Shaw writes,

{{quote|When the judge assaults the kid in the Fort Griffin jakes… he betrays a complex of psychological, historical and sexual values of which the kid has no conscious awareness, but which are distinctly conveyed to the reader. Ultimately, it is the kid's personal humiliation which impacts the reader most tellingly. In the virile warrior culture which dominates that text and to which the reader has become acclimated, seduction into public homoeroticism is a dreadful fate. We do not see behind the outhouse door to know the details of the kid's corruption. It may be as simple as the embrace that we do witness or as violent as the [[sodomy]] implied by the judge's killing of the Indian children. The kid's powerful survival instinct perhaps suggests that he is a more willing participant than a victim. However, the degree of debasement and the extent of the kid's willingness are incidental. The public revelation of the act is what matters. Other men have observed the kid's humiliation… In such a male culture, public homoeroticism is untenable and it is this sudden revelation that horrifies the observers at Fort Griffin. No other act could offend their masculine sensibilities as the shock they display… This triumph over the kid is what the exhibitionist and homoerotic judge celebrates by dancing naked atop the wall, just as he did after assaulting the half-breed boy.|Patrick W. Shaw|"The Kid's Fate, the Judge's Guilt"<ref>Shaw, p. 117–118.</ref>}}

Yet Shaw’s effort to penetrate the mystery in the jakes has not managed to satisfy other critics,  who have rejected his thesis as more sensational than textual:
{{quote|Patrick W. Shaw's article . . . reviews the controversy over the end of McCarthy's masterpiece: does the judge kill the kid in the 'jakes' or does he merely sexually assault him? Shaw then goes on to review Eric Fromm's distinction between benign and malignant aggression – benign aggression being only used for survival and is rooted in human instinct, whereas malignant aggression is destructive and is based in human character.  It is Shaw's thesis that McCarthy fully accepts and exemplifies Fromm's malignant aggression, which he sees as part of the human condition, and which we do well to heed, for without this acceptation we risk losing ourselves in intellectual and physical servitude. Shaw goes in for a certain amount of special pleading: the Comanches sodomizing their dying victims; the kid's exceptional aggression and ability, so that the judge could not have killed him that easily; the judge deriving more satisfaction from tormenting than from eliminating.  Since the judge considers the kid has reserved some clemency in his soul, Shaw argues, that the only logical step is that the judge humiliates him by sodomy. This is possible, but unlikely. The judge gives one the impression, not so much of male potency, but of impotence.  His mountainous, hairless flesh is more that of a eunuch than a man.  Having suggested paedophilia, Shaw then goes back to read other episodes in terms of the judge's paedophilia:  the hypothesis thus becomes the premise.  And in so arguing, Shaw falls into the same trap of narrative closure for which he has been berating other critics.  The point about ''Blood Meridian'' is that we do not know and we cannot know.|Peter J. Kitson (Ed.)|"The Year's Work in English Studies Volume 78 (1997)"<ref>Kitson, p. 809.</ref>}}

===Gnosticism===
Various discussions by Leo Daugherty, Barclay Owens, Harold Bloom and others, have resulted from the second epigraph of the three which are used by the author to introduce the novel taken from the [[Gnosticism|"Gnostic"]] [[Christian mysticism|mystic]] [[Jakob Böhme|Jacob Boehme]].{{citation needed|date=April 2018}} The quote from Boehme reads as follows: "It is not to be thought that the life of darkness is sunk in misery and lost as if in sorrowing. There is no sorrowing. For sorrow is a thing that is swallowed up in death, and death and dying are the very life of the darkness."<ref>{{cite book |last= Mundik |first=Petra |date=May 15, 2016 |title=A Bloody and Barbarous God: The Metaphysics of Cormac McCarthy |page= 32 |url=https://books.google.com/books?id=QQzbCwAAQBAJ&pg=PA32&lpg=PA32&dq=%22It+is+not+to+be+thought+that+the+life+of+darkness+is+sunk+in+misery+and+lost+as+if+in+sorrowing.+There+is+no+sorrowing.+For+sorrow+is+a+thing+that+is+swallowed+up+in+death,+and+death+and+dying+are+the+very+life+of+the+darkness.%22&source=bl&ots=xOj63kxbcQ&sig=6N9MPa26nn79oGwXhiU-rVQx9jk&hl=en&sa=X&ved=2ahUKEwjBvLak34jdAhV6HTQIHSoTC8EQ6AEwB3oECAUQAQ#v=onepage&q=%22It%20is%20not%20to%20be%20thought%20that%20the%20life%20of%20darkness%20is%20sunk%20in%20misery%20and%20lost%20as%20if%20in%20sorrowing.%20There%20is%20no%20sorrowing.%20For%20sorrow%20is%20a%20thing%20that%20is%20swallowed%20up%20in%20death%2C%20and%20death%20and%20dying%20are%20the%20very%20life%20of%20the%20darkness.%22&f=false |location= |publisher= University of New Mexico Press|accessdate=August 25, 2018 }}</ref> No specific conclusions have been reached concerning its interpretation and the extent of its direct or indirect relevance to the novel.{{citation needed|date=April 2018}}

These critics agree that there are [[Gnostic]] elements present in ''Blood Meridian,'' but they disagree on the precise meaning and implication of those elements. One of the most detailed of these arguments is made by Leo Daugherty in his 1992 article, "''Blood Meridian'' as Gnostic Tragedy." Daugherty argues "Gnostic thought is central to Cormac McCarthy's ''Blood Meridian''" (Daugherty, 122); specifically, the [[Persia]]n-[[Zoroastrianism|Zoroastrian]]-[[Manichaeism|Manichean]] branch of Gnosticism. He describes the novel as a "rare coupling of Gnostic 'ideology' with the 'affect' of [[Greek tragedy|Hellenic tragedy]] by means of depicting how power works in the making and erasing of culture, and of what the human condition amounts to when a person opposes that power and thence gets introduced to [[destiny|fate]]."<ref>Daugherty, p. 129.</ref>

Daugherty sees Holden as an [[Archon (Gnosticism)|archon]], and the kid as a "failed ''[[Pneumatic (Gnosticism)|pneuma]]''."{{citation needed|date=April 2018}} Daugherty makes the interpretive claim that the kid feels a "spark of the alien divine."<ref>Daugherty, Leo. “Gravers False and True: Blood Meridian as Gnostic Tragedy.” Perspectives on Cormac McCarthy. Ed. Edwin T. Arnold and Dianne C. Luce. University Press of Mississippi: Jackson, 1993. 157-172
</ref> Furthermore, the kid rarely initiates violence, usually doing so only when urged by others or in self-defense.{{citation needed|date=April 2018}} Holden, however, speaks of his desire to dominate the earth and all who dwell on it, by any means: from outright violence to deception and trickery.{{citation needed|date=April 2018}} He expresses his wish to become a "[[suzerain]]," one who "rules even when there are other rulers" and whose power overrides all others'.{{citation needed|date=April 2018}} In 2009, Bloom did refer to Boehme in the context of ''Blood Meridian'' as, "a very specific type of [[Kabbalistic]] Gnostic".{{citation needed|date=April 2018}}

Daugherty contends that the staggering violence of the novel can best be understood through a Gnostic lens. "[[Evil]]" as defined by the Gnostics was a far larger, more pervasive presence in human life than the rather tame and "domesticated" [[Satan]] of Christianity. As Daugherty writes, "For [Gnostics], evil was simply everything that ''is'', with the exception of bits of spirit imprisoned here. And what they saw is what we see in the world of ''Blood Meridian''."<ref>Daugherty, p. 124; emphasis in original.</ref> Barcley Owens argues that, while there are undoubtedly Gnostic qualities to the novel, Daugherty's arguments are "ultimately unsuccessful,"<ref>Owens, p. 12.</ref> because Daugherty fails to address the novel's pervasive violence adequately and because he overstates the kid's goodness.{{citation needed|date=April 2018}}

===Theodicy===
Another major theme concerning ''Blood Meridian'' involves the subject of [[theodicy]]. Theodicy in general refers to the issue of the philosophical or theological attempt to justify the existence of that which is metaphysically or philosophically good in a world which contains so much apparent and manifest evil. Douglas Canfield in his essay "Theodicy in ''Blood Meridian''" (in his book ''Mavericks on the Border'', 2001, Lexington University Press)<ref>{{cite book|last=Canfield|first=J. D.| title =Mavericks on the Border| publisher=University Press of Kentucky | year=2001 |page=|isbn=978-0-813-12672-2 }}</ref> asserts that theodicy is the central theme of ''Blood Meridian''. James Wood in his essay for ''[[The New Yorker]]'' entitled "Red Planet" from 2005 took a similar position to this in recognizing the issue of the general justification of metaphysical goodness in the presence of evil in the world as a recurrent theme in the novel.<ref name="NYM">{{cite journal |last= Wood |first=James |date=July 25, 2005 |title=Red Planet: The sanguinary sublime of Cormac McCarthy |url=https://www.newyorker.com/magazine/2005/07/25/red-planet |journal=[[The New Yorker]] |location=New York |publisher= |accessdate=August 25, 2018 }}</ref> This was directly supported by Edwin Turner on 28 September 2010 in his essay on ''Blood Meridian'' for ''Biblioklept''.<ref>{{cite web |last= Turner |first=Edwin |date=September 27, 2010 |title=Blood Meridian |url=https://biblioklept.org/2010/09/27/blood-meridian-cormac-mccarthy/ |location= |publisher= |accessdate=August 25, 2018 }}</ref> Chris Dacus in the ''Cormac McCarthy Journal'' for 2009 wrote the essay entitled, "The West as Symbol of the Eschaton in Cormac McCarthy," where he expressed his preference for discussing the theme of theodicy in its eschatological terms in comparison to the theological scene of the last judgment.{{citation needed|date=February 2019}} This preference for reading theodicy as an eschatological theme was further affirmed by Harold Bloom in his recurrent phrase of referring to the novel as "The Authentic Apocalyptic Novel."<ref>{{cite web |last= |first=|date=November 28, 2000 |title=Interview with Harold Bloom |url=http://mural.uv.es/jahesa/interbloom.htm |location= |publisher= |accessdate=August 25, 2018 }}</ref>

==Background==
McCarthy wrote ''Blood Meridian'' while living on the money from his 1981 [[MacArthur Fellows Program|MacArthur Fellows]] grant. It is his first novel set in the [[Southwestern United States]], a change from the [[Appalachia]]n settings of his earlier work. In his essay for the ''Slate Book Review'' from 5 October 2012 entitled "Cormac McCarthy Cuts to the Bone", Noah Shannon summarizes the existing library archives of the first drafts of the novel as dating to the mid-1970s. The review includes digital archive images of several of McCarthy's own type-script pages for early versions of the novel.<ref name="shannon">Shannon, Noah (2012-10-05). "Cormac McCarthy Cuts to the Bone". ''Slate Book Review'', 5 October 2012.</ref>

McCarthy conducted considerable research to write the book. Critics have repeatedly demonstrated that even brief and seemingly inconsequential passages of ''Blood Meridian'' rely on historical evidence. The Glanton gang segments are based on [[Samuel Chamberlain]]'s account of the group in his memoir ''My Confession: The Recollections of a Rogue'', which he wrote during the latter part of his life. Chamberlain rode with [[John Joel Glanton]] and his company between 1849 and 1850. The novel's antagonist Judge Holden appeared in Chamberlain's account, but his true identity remains a mystery. Chamberlain does not appear in the novel.

===Style===
McCarthy told [[Oprah Winfrey]] in an interview that he prefers "simple declarative sentences" and that he uses capital letters, periods, an occasional comma, a colon for setting off a list, but never semicolons.<ref>{{cite book|first=Kenneth|last=Lincoln|title=Cormac McCarthy|location=Basingstoke|publisher=Palgrave Macmillan|year=2009|isbn=978-0230619678|page=14}}</ref> He does not use quotation marks for dialogue and believes there is no reason to "blot the page up with weird little marks".<ref>{{cite book|first=David|last=Crystal|title=Making a Point: The Pernickity Story of English Punctuation|year=2015|publisher=Profile Book|location=London|isbn=978-1781253502|page=92}}</ref> Describing events of extreme violence, McCarthy's prose is sparse, yet expansive, with an often [[Bible|biblical]] quality and frequent religious references. McCarthy's writing style involves many unusual or archaic words, no [[quotation mark]]s for [[dialogue]], and no [[apostrophe]]s to signal most contractions.

==Reception==

While ''Blood Meridian'' initially received little recognition, it has since been recognized as McCarthy's masterpiece, and one of the [[Great American Novel|greatest works of American literature]]. American literary critic Harold Bloom praised ''Blood Meridian'' as one of the 20th century's finest novels.<ref>{{Cite web | title=Bloom on "Blood Meridian" | url=http://www.cormacmccarthy.com/works/bloodmeridian.htm | deadurl=yes | archiveurl=https://web.archive.org/web/20060324165326/http://www.cormacmccarthy.com/works/bloodmeridian.htm | archivedate=2006-03-24 | df= }}</ref> [[Time (magazine)|''Time'']] magazine included the novel in its "TIME 100 Best English-language Novels from 1923 to 2005".<ref>{{Cite news| url=http://www.time.com/time/2005/100books/the_complete_list.html | work=Time | title=All Time 100 Novels | accessdate=April 26, 2010 | date=2005-10-16}}</ref>

[[Aleksandar Hemon]] has called ''Blood Meridian'' "possibly the greatest American novel of the past 25 years."  In 2006, ''The New York Times'' conducted a poll of writers and critics regarding the most important works in American fiction from the previous 25 years; ''Blood Meridian'' was a runner-up, along with [[John Updike]]'s four novels about [[Rabbit Angstrom]] and [[Don DeLillo]]'s ''[[Underworld (DeLillo novel)|Underworld]]'' while [[Toni Morrison]]'s ''[[Beloved (novel)|Beloved]]'' topped the list.<ref>''New York Times, Sunday Magazine'', May 21, 2006, p. 16.</ref> Novelist [[David Foster Wallace]] named ''Blood Meridian'' one of the five most underappreciated American novels since 1960<ref>{{cite web|last=Wallace|first=David Foster|title=Overlooked|url=http://www.salon.com/1999/04/12/wallace/|publisher=Salon|accessdate=2014-04-16}}</ref> and described it as "[p]robably the most horrifying book of this century, at least [in] fiction."<ref>{{cite web|title=Gus Van Sant Interviews David Foster Wallace|url=http://www.electriccereal.com/gus-van-sant-interviews-david-foster-wallace/|accessdate=2014-04-16}}</ref>

==Literary significance==

Academics and critics have variously suggested that ''Blood Meridian'' is [[Nihilism|nihilistic]] or strongly [[morality|moral]]; a [[satire]] of the western genre, a savage indictment of [[Manifest Destiny]]. [[Harold Bloom]] called it "the ultimate western;" J. Douglas Canfield described it as "a [[grotesque]] ''[[Bildungsroman]]'' in which we are denied access to the protagonist's consciousness almost entirely."<ref>Canfield, p. 37.</ref> Comparisons have been made to the work of [[Hieronymus Bosch]] and [[Sam Peckinpah]], and of [[Dante Alighieri]] and [[Louis L'Amour]]. However, there is no consensus interpretation; James D. Lilley writes that the work "seems designed to elude interpretation."<ref name="Lilley, p. 19"/> After reading ''Blood Meridian,'' Richard Selzer declared that McCarthy "is a genius--also probably somewhat insane."<ref>Owens, p. 9.</ref> Critic [[Steven Shaviro]] wrote:

{{quote|In the entire range of [[American literature]], only ''[[Moby-Dick]]'' bears comparison to ''Blood Meridian.'' Both are [[Epic poetry|epic]] in scope, cosmically resonant, obsessed with open space and with language, exploring vast uncharted distances with a fanatically patient minuteness. Both manifest a sublime visionary power that is matched only by still more ferocious [[irony]]. Both savagely explode the American dream of [[manifest destiny]] [''sic''] of racial domination and endless imperial expansion. But if anything, McCarthy writes with a yet more terrible clarity than does Melville.|Steven Shaviro|"A Reading of ''Blood Meridian''"<ref>Shaviro, pp. 111–112.</ref>}}

==Attempted film adaptations==
There have been a number of attempts to create a motion picture adaptation of ''Blood Meridian''. However, all have failed during the development or [[pre-production]] stages. A common perception is that the story is "unfilmable", due to its unrelenting violence and dark tone. In an interview with Cormac McCarthy by ''[[The Wall Street Journal]]'' in 2009, McCarthy denied this notion, with his perspective being that it would be "very difficult to do and would require someone with a bountiful imagination and a lot of balls. But the payoff could be extraordinary."<ref>{{cite web | last = John | first = Jurgensen | url = https://www.wsj.com/articles/SB10001424052748704576204574529703577274572 | title = Cormac McCarthy | publisher = ''[[The Wall Street Journal]]'' | date = November 20, 2009 | accessdate = May 21, 2016}}</ref>

Screenwriter [[Steve Tesich]] first adapted ''Blood Meridian'' into a screenplay in 1995. In the late 1990s, [[Tommy Lee Jones]] acquired the film adaptation rights to the story and subsequently rewrote Tesich's screenplay, with the idea of directing and playing a role in it.<ref>{{cite web | last = Balchack | first = Brian | url = http://movieweb.com/william-monahan-to-adapt-blood-meridian/ | title = William Monahan to adapt Blood Meridian | publisher = [[MovieWeb]] | date = May 9, 2014 | accessdate = May 21, 2016}}</ref> Due to film studios avoiding the project's overall violence, production could not move forward. <ref name="FrancoColumn">{{cite web | author = [[James Franco|Franco, James]] | url = https://www.vice.com/en_uk/read/adapting-blood-meridian | title = Adapting 'Blood Meridian' | publisher = ''[[Vice (magazine)|Vice]]'' | date = July 6, 2014 | accessdate = May 21, 2016}}</ref>

Following the end of production for ''[[Kingdom of Heaven (film)|Kingdom of Heaven]]'' in 2004, screenwriter [[William Monahan]] and director [[Ridley Scott]] entered discussions with producer [[Scott Rudin]] for adapting ''Blood Meridian'' with [[Paramount Pictures]] financing.<ref>{{cite web | author = Stax | url = http://www.ign.com/articles/2004/05/10/ridley-onboard-blood-meridian | title = Ridley Scott Onboard Blood Meridian? | publisher = [[IGN]] | date = May 10, 2004 | accessdate = May 21, 2016}}</ref> In an interview with ''[[Eclipse Magazine]]'' published in June 2008, Scott confirmed that the screenplay had been written, but that the extensive violence was proving to be a challenge for film standards.<ref>{{cite web | last = Essman | first = Scott | url = http://eclipsemagazine.com/hollywood-insider/interview-the-great-ridley-scott-speaks-with-eclipse-by-scott-essman/5812 | title = INTERVIEW: The great Ridley Scott Speaks with Eclipse by Scott Essman | publisher = ''Eclipse Magazine'' | date = June 3, 2008 | archiveurl = https://web.archive.org/web/20080604172245/http://eclipsemagazine.com/hollywood-insider/interview-the-great-ridley-scott-speaks-with-eclipse-by-scott-essman/5812 | archivedate = June 4, 2008 | accessdate = May 21, 2016}}</ref> This later led to Scott and Monhan leaving the project, resulting in another abandoned adaptation.<ref>{{cite web | last = Horn | first = John | url = http://articles.latimes.com/2008/aug/17/entertainment/ca-road17? | title = Cormac McCarthy's 'The Road' comes to the screen | publisher = ''[[Los Angeles Times]]'' | date = August 17, 2008 | archiveurl = https://web.archive.org/web/20090615071052/http://articles.latimes.com/2008/aug/17/entertainment/ca-road17 | archivedate = June 15, 2009 | accessdate = May 21, 2016 | deadurl = yes | df =  }}</ref>

By early 2011, [[James Franco]] was thinking of adapting ''Blood Meridian'', along with a number of other [[William Faulkner]] and Cormac McCarthy novels.<ref>{{cite web | author = [[Roger Friedman|Friendman, Roger]] | url = http://www.showbiz411.com/2011/01/03/exclusive-james-franco-planning-to-direct-faulkner-cormac-mccarthy-classics | title = Exclusive: James Franco Planning to Direct Faulkner, Cormac McCarthy Classics | publisher = [[Showbiz411]] | date = January 3, 2011 | accessdate = May 22, 2016}}</ref> After being persuaded by [[Andrew Dominik]] to adapt the novel, Franco shot twenty-five minutes of test footage, starring [[Scott Glenn]], [[Mark Pellegrino]], [[Luke Perry]] and [[Dave Franco]]. For undisclosed reasons, Rudin denied further production of the film.<ref name="FrancoColumn"/> On May 5, 2016, ''[[Variety (magazine)|Variety]]'' revealed that Franco was negotiating with Rudin to write and direct an adaptation to be brought to the [[Marché du Film]], with [[Russell Crowe]], [[Tye Sheridan]] and [[Vincent D'Onofrio]] starring. However, later that day, it was reported that the project dissolved, due to issues concerning the film rights.<ref>{{cite web | last = Kroll | first = Justin | url = https://variety.com/2016/film/news/russell-crowe-james-franco-blood-meridian-1201767424/ | title = Russell Crowe in Talks to Star in James Franco-Directed ‘Blood Meridian’ | date = May 5, 2016 | publisher = ''[[Variety (magazine)|Variety]]'' | accessdate = May 22, 2016}}</ref>

[[Lynne Ramsay]] has expressed an interest in adapting the novel.<ref>{{Cite web|url=https://www.reddit.com/r/movies/comments/8a345x/im_lynne_ramsay_writer_and_director_of_you_were/dwvnhzi/|title=r/movies - I’m Lynne Ramsay, writer and director of You Were Never Really Here. AMA, r/movies!|website=reddit|language=en|access-date=2018-11-07}}</ref>

==Notes==
{{Reflist|30em}}

==References==
* {{cite book |last=Canfield |first=J. Douglas |title=Mavericks on the Border: Early Southwest in Historical fiction and Film |publisher=University Press of Kentucky |year=2001 |isbn=0-8131-2180-9 }}
* {{cite journal |last=Daugherty |first=Leo |title=Gravers False and True: Blood Meridian as Gnostic Tragedy |journal=Southern Quarterly |volume=30 |issue=4 |year=1992 |pages=122–133 }}
* {{cite book |last=Lilley |first=James D. |chapter=History and the Ugly Facts of ''Blood Meridian'' |title=Cormac McCarthy: New Directions |publisher=University of New Mexico Press |location=Albuquerque |year=2014 |isbn=978-0-8263-2767-3 }}
* {{cite book |last=Owens |first=Barcley |title=Cormac McCarthy's Western Novels |publisher=University of Arizona Press |year=2000 |isbn=0-8165-1928-5 }}
* {{cite book |first=Christoph |last=Schneider |chapter=Pastorale Hoffnungslosigkeit. Cormac McCarthy und das Böse |editor-first=Natalia |editor-last=Borissova |editor2-first=Susi K. |editor2-last=Frank |editor3-first=Andreas |editor3-last=Kraft |title=Zwischen Apokalypse und Alltag. Kriegsnarrative des 20. und 21. Jahrhunderts |location=Bielefeld |year=2009 |pages=171–200 }}
* {{cite journal |last=Shaviro |first=Steven |title=A Reading of ''Blood Meridian'' |journal=Southern Quarterly |volume=30 |issue=4 |year=1992 |pages= }}
* {{cite journal |last=Shaw |first=Patrick W. |title=The Kid's Fate, the Judge's Guilt: Ramifications of Closure in Cormac McCarthy's ''Blood Meridian'' |journal=Southern Literary Journal |year=1997 |pages=102–119 }}
* {{cite journal |last=Stratton |first=Billy J. |title=‘el brujo es un coyote’: Taxonomies of Trauma in Cormac McCarthy's Blood Meridian |journal=Arizona Quarterly: A Journal of American Literature, Culture, and Theory |volume=67 |issue=3 |year=2011 |pages=151–172 |doi=10.1353/arq.2011.0020 }}

==Further reading==
* {{cite book |title=Notes on Blood Meridian |edition=Revised and Expanded |first=John |last=Sepich |others=Foreword by Edwin T. Arnold |series=Southwestern Writers Collection Series |publisher=University of Texas Press |year=2008 |isbn=978-0-292-71821-0 |url=http://www.thewittliffcollections.txstate.edu/book-series/notesonblood.html }}

==External links==
{{Wikiquote}}
* [https://www.nytimes.com/1985/04/28/books/mccarthy-meridian.html James, C., Blood Meridian by Cormac McCarthy, ''The New York Times'', Apr 1985]
* [http://www.thenewcanon.com/Blood_Meridian.html ''Blood Meridian'' by Cormac McCarthy], reviewed by Ted Gioia ([http://www.thenewcanon.com  The New Canon])
* [https://www.npr.org/templates/story/story.php?storyId=99347082 NPR interview with Ben Nichols about his record ''The Last Pale Light in the West'', inspired by ''Blood Meridian'']

{{Cormac McCarthy}}

[[Category:1985 American novels]]
[[Category:Novels by Cormac McCarthy]]
[[Category:American bildungsromans]]
[[Category:American historical novels]]
[[Category:Western (genre) novels]]
[[Category:Novels set in Texas]]
[[Category:Novels set in Mexico]]
[[Category:Novels set in Arizona]]
[[Category:Novels set in California]]
[[Category:Fiction set in 1849]]
[[Category:Fiction set in 1850]]
[[Category:Fiction set in 1878]]`;
